import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: Date
  userId?: number
  room?: string
}

export interface WebSocketConnection {
  id: string
  userId?: number
  userEmail?: string
  userRole?: string
  rooms: Set<string>
  connectedAt: Date
  lastActivity: Date
}

export interface WebSocketRoom {
  name: string
  connections: Set<string>
  createdAt: Date
  metadata?: Record<string, any>
}

export class WebSocketManager {
  private static instance: WebSocketManager
  private io: SocketIOServer
  private prisma: PrismaClient
  private connections: Map<string, WebSocketConnection> = new Map()
  private rooms: Map<string, WebSocketRoom> = new Map()
  private isInitialized: boolean = false

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): WebSocketManager {
    if (!WebSocketManager.instance && prisma) {
      WebSocketManager.instance = new WebSocketManager(prisma)
    }
    return WebSocketManager.instance
  }

  initialize(httpServer: HTTPServer): void {
    if (this.isInitialized) {
      return
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.WEB_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    this.isInitialized = true
    logger.info('WebSocket manager initialized')
  }

  private setupEventHandlers(): void {
    this.io.on('connection', async (socket) => {
      logger.info(`WebSocket client connected: ${socket.id}`)

      // Authenticate connection
      const authenticated = await this.authenticateConnection(socket)
      if (!authenticated) {
        socket.disconnect()
        return
      }

      // Store connection info
      const connection: WebSocketConnection = {
        id: socket.id,
        userId: socket.data.userId,
        userEmail: socket.data.userEmail,
        userRole: socket.data.userRole,
        rooms: new Set(),
        connectedAt: new Date(),
        lastActivity: new Date()
      }
      this.connections.set(socket.id, connection)

      // Join user to personal room
      if (connection.userId) {
        await this.joinRoom(socket.id, `user:${connection.userId}`)
      }

      // Join user to role-based room
      if (connection.userRole) {
        await this.joinRoom(socket.id, `role:${connection.userRole}`)
      }

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket.id)
      })

      // Handle room joins
      socket.on('join-room', async (roomName: string) => {
        await this.joinRoom(socket.id, roomName)
      })

      // Handle room leaves
      socket.on('leave-room', async (roomName: string) => {
        await this.leaveRoom(socket.id, roomName)
      })

      // Handle custom events
      socket.on('message', async (message: WebSocketMessage) => {
        await this.handleMessage(socket.id, message)
      })

      // Handle activity
      socket.on('activity', () => {
        this.updateActivity(socket.id)
      })

      // Send welcome message
      socket.emit('connected', {
        type: 'connected',
        data: {
          userId: connection.userId,
          userEmail: connection.userEmail,
          userRole: connection.userRole,
          timestamp: new Date()
        }
      })
    })
  }

  private async authenticateConnection(socket: any): Promise<boolean> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization

      if (!token) {
        logger.warn('WebSocket connection without token')
        return false
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as any
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user || !user.active) {
        logger.warn(`WebSocket authentication failed for user ${decoded.userId}`)
        return false
      }

      socket.data.userId = user.id
      socket.data.userEmail = user.email
      socket.data.userRole = user.role

      return true
    } catch (error) {
      logger.error('WebSocket authentication error:', error)
      return false
    }
  }

  private async joinRoom(socketId: string, roomName: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(socketId)
    if (!socket) return

    const connection = this.connections.get(socketId)
    if (!connection) return

    socket.join(roomName)
    connection.rooms.add(roomName)

    // Create room if it doesn't exist
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, {
        name: roomName,
        connections: new Set(),
        createdAt: new Date()
      })
    }

    this.rooms.get(roomName)!.connections.add(socketId)

    socket.emit('room-joined', {
      type: 'room-joined',
      data: { room: roomName },
      timestamp: new Date()
    })

    logger.info(`Socket ${socketId} joined room: ${roomName}`)
  }

  private async leaveRoom(socketId: string, roomName: string): Promise<void> {
    const socket = this.io.sockets.sockets.get(socketId)
    if (!socket) return

    const connection = this.connections.get(socketId)
    if (!connection) return

    socket.leave(roomName)
    connection.rooms.delete(roomName)

    const room = this.rooms.get(roomName)
    if (room) {
      room.connections.delete(socketId)
      if (room.connections.size === 0) {
        this.rooms.delete(roomName)
      }
    }

    socket.emit('room-left', {
      type: 'room-left',
      data: { room: roomName },
      timestamp: new Date()
    })

    logger.info(`Socket ${socketId} left room: ${roomName}`)
  }

  private async handleMessage(socketId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(socketId)
    if (!connection) return

    message.userId = connection.userId
    message.timestamp = new Date()

    // Log message
    logger.info(`WebSocket message from ${socketId}: ${message.type}`)

    // Handle different message types
    switch (message.type) {
      case 'notification':
        await this.handleNotificationMessage(socketId, message)
        break
      case 'data-update':
        await this.handleDataUpdateMessage(socketId, message)
        break
      case 'chat':
        await this.handleChatMessage(socketId, message)
        break
      default:
        logger.warn(`Unknown message type: ${message.type}`)
    }
  }

  private async handleNotificationMessage(socketId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(socketId)
    if (!connection) return

    // Broadcast to appropriate users
    if (message.data.targetUsers) {
      for (const userId of message.data.targetUsers) {
        this.io.to(`user:${userId}`).emit('notification', message)
      }
    } else if (message.data.targetRoles) {
      for (const role of message.data.targetRoles) {
        this.io.to(`role:${role}`).emit('notification', message)
      }
    } else {
      // Broadcast to all connected users
      this.io.emit('notification', message)
    }
  }

  private async handleDataUpdateMessage(socketId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(socketId)
    if (!connection) return

    // Broadcast data updates to relevant rooms
    if (message.room) {
      this.io.to(message.room).emit('data-update', message)
    } else {
      // Broadcast to all users
      this.io.emit('data-update', message)
    }
  }

  private async handleChatMessage(socketId: string, message: WebSocketMessage): Promise<void> {
    const connection = this.connections.get(socketId)
    if (!connection) return

    // Broadcast chat message to room
    if (message.room) {
      this.io.to(message.room).emit('chat', message)
    }
  }

  private handleDisconnection(socketId: string): void {
    const connection = this.connections.get(socketId)
    if (!connection) return

    // Remove from all rooms
    for (const roomName of connection.rooms) {
      const room = this.rooms.get(roomName)
      if (room) {
        room.connections.delete(socketId)
        if (room.connections.size === 0) {
          this.rooms.delete(roomName)
        }
      }
    }

    this.connections.delete(socketId)
    logger.info(`WebSocket client disconnected: ${socketId}`)
  }

  private updateActivity(socketId: string): void {
    const connection = this.connections.get(socketId)
    if (connection) {
      connection.lastActivity = new Date()
    }
  }

  // Public methods for sending messages
  async sendToUser(userId: number, message: WebSocketMessage): Promise<void> {
    this.io.to(`user:${userId}`).emit(message.type, message)
  }

  async sendToRole(role: string, message: WebSocketMessage): Promise<void> {
    this.io.to(`role:${role}`).emit(message.type, message)
  }

  async sendToRoom(roomName: string, message: WebSocketMessage): Promise<void> {
    this.io.to(roomName).emit(message.type, message)
  }

  async broadcast(message: WebSocketMessage): Promise<void> {
    this.io.emit(message.type, message)
  }

  async sendNotification(
    targetUsers?: number[],
    targetRoles?: string[],
    notification: any = {}
  ): Promise<void> {
    const message: WebSocketMessage = {
      type: 'notification',
      data: notification,
      timestamp: new Date()
    }

    if (targetUsers) {
      for (const userId of targetUsers) {
        await this.sendToUser(userId, message)
      }
    } else if (targetRoles) {
      for (const role of targetRoles) {
        await this.sendToRole(role, message)
      }
    } else {
      await this.broadcast(message)
    }
  }

  async sendDataUpdate(
    roomName: string,
    data: any,
    action: 'create' | 'update' | 'delete' = 'update'
  ): Promise<void> {
    const message: WebSocketMessage = {
      type: 'data-update',
      data: {
        action,
        data,
        timestamp: new Date()
      },
      room: roomName,
      timestamp: new Date()
    }

    await this.sendToRoom(roomName, message)
  }

  // Statistics and monitoring
  getConnectionStats(): any {
    const totalConnections = this.connections.size
    const totalRooms = this.rooms.size

    const connectionsByRole = new Map<string, number>()
    for (const connection of this.connections.values()) {
      const role = connection.userRole || 'anonymous'
      connectionsByRole.set(role, (connectionsByRole.get(role) || 0) + 1)
    }

    const roomStats = Array.from(this.rooms.values()).map(room => ({
      name: room.name,
      connections: room.connections.size,
      createdAt: room.createdAt
    }))

    return {
      totalConnections,
      totalRooms,
      connectionsByRole: Object.fromEntries(connectionsByRole),
      rooms: roomStats
    }
  }

  getActiveConnections(): WebSocketConnection[] {
    return Array.from(this.connections.values())
  }

  getActiveRooms(): WebSocketRoom[] {
    return Array.from(this.rooms.values())
  }

  async cleanupInactiveConnections(timeoutMinutes: number = 30): Promise<number> {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(cutoffTime.getMinutes() - timeoutMinutes)

    let cleanedCount = 0
    for (const [socketId, connection] of this.connections.entries()) {
      if (connection.lastActivity < cutoffTime) {
        const socket = this.io.sockets.sockets.get(socketId)
        if (socket) {
          socket.disconnect()
          cleanedCount++
        }
      }
    }

    logger.info(`Cleaned up ${cleanedCount} inactive WebSocket connections`)
    return cleanedCount
  }

  // Room management
  async createRoom(roomName: string, metadata?: Record<string, any>): Promise<void> {
    if (this.rooms.has(roomName)) {
      throw new Error(`Room ${roomName} already exists`)
    }

    this.rooms.set(roomName, {
      name: roomName,
      connections: new Set(),
      createdAt: new Date(),
      metadata
    })

    logger.info(`Created WebSocket room: ${roomName}`)
  }

  async deleteRoom(roomName: string): Promise<void> {
    const room = this.rooms.get(roomName)
    if (!room) {
      throw new Error(`Room ${roomName} not found`)
    }

    // Disconnect all users from room
    for (const socketId of room.connections) {
      const socket = this.io.sockets.sockets.get(socketId)
      if (socket) {
        socket.leave(roomName)
        socket.emit('room-deleted', {
          type: 'room-deleted',
          data: { room: roomName },
          timestamp: new Date()
        })
      }
    }

    this.rooms.delete(roomName)
    logger.info(`Deleted WebSocket room: ${roomName}`)
  }

  getRoomInfo(roomName: string): WebSocketRoom | null {
    return this.rooms.get(roomName) || null
  }
} 