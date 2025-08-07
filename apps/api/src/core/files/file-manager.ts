import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'
import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs'
import { join, extname, basename } from 'path'
import { pipeline } from 'stream/promises'
import { v4 as uuidv4 } from 'uuid'
import { createHash } from 'crypto'

export interface FileUploadOptions {
  allowedTypes?: string[]
  maxSize?: number
  generateThumbnail?: boolean
  compress?: boolean
  metadata?: Record<string, any>
}

export interface FileInfo {
  id: string
  originalName: string
  filename: string
  path: string
  size: number
  mimeType: string
  extension: string
  hash: string
  metadata?: Record<string, any>
  uploadedBy?: number
  createdAt: Date
}

export interface FileQuery {
  uploadedBy?: number
  mimeType?: string
  extension?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export class FileManager {
  private static instance: FileManager
  private prisma: PrismaClient
  private uploadDir: string
  private allowedTypes: string[]
  private maxSize: number

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.uploadDir = config.FILE_UPLOAD_DIR || './uploads'
    this.allowedTypes = config.FILE_ALLOWED_TYPES || ['image/*', 'application/pdf', 'text/*']
    this.maxSize = config.FILE_MAX_SIZE || 10 * 1024 * 1024 // 10MB

    this.ensureUploadDir()
  }

  static getInstance(prisma?: PrismaClient): FileManager {
    if (!FileManager.instance && prisma) {
      FileManager.instance = new FileManager(prisma)
    }
    return FileManager.instance
  }

  private ensureUploadDir(): void {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(
    file: any,
    options: FileUploadOptions = {},
    uploadedBy?: number
  ): Promise<FileInfo> {
    const {
      allowedTypes = this.allowedTypes,
      maxSize = this.maxSize,
      generateThumbnail = false,
      compress = false,
      metadata = {}
    } = options

    // Validate file
    await this.validateFile(file, allowedTypes, maxSize)

    // Generate unique filename
    const extension = extname(file.filename)
    const filename = `${uuidv4()}${extension}`
    const filePath = join(this.uploadDir, filename)

    // Calculate file hash
    const hash = await this.calculateFileHash(file.file)

    // Check for duplicate files
    const existingFile = await this.prisma.file.findFirst({
      where: { hash }
    })

    if (existingFile) {
      logger.info(`Duplicate file detected: ${existingFile.filename}`)
      return this.getFileInfo(existingFile)
    }

    // Save file to disk
    await this.saveFileToDisk(file.file, filePath)

    // Generate thumbnail if requested
    let thumbnailPath: string | undefined
    if (generateThumbnail && file.mimetype.startsWith('image/')) {
      thumbnailPath = await this.generateThumbnail(filePath)
    }

    // Compress file if requested
    let compressedPath: string | undefined
    if (compress && file.mimetype.startsWith('image/')) {
      compressedPath = await this.compressFile(filePath)
    }

    // Save file record to database
    const fileRecord = await this.prisma.file.create({
      data: {
        originalName: file.filename,
        filename,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        extension,
        hash,
        metadata: {
          ...metadata,
          thumbnailPath,
          compressedPath
        },
        uploadedBy
      }
    })

    logger.info(`File uploaded successfully: ${filename}`)
    return this.getFileInfo(fileRecord)
  }

  private async validateFile(
    file: any,
    allowedTypes: string[],
    maxSize: number
  ): Promise<void> {
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize} bytes`)
    }

    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '')
        return file.mimetype.startsWith(baseType)
      }
      return file.mimetype === type
    })

    if (!isAllowed) {
      throw new Error(`File type ${file.mimetype} is not allowed`)
    }
  }

  private async calculateFileHash(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256')
      stream.on('data', (chunk: Buffer) => {
        hash.update(chunk)
      })
      stream.on('end', () => {
        resolve(hash.digest('hex'))
      })
      stream.on('error', reject)
    })
  }

  private async saveFileToDisk(stream: any, filePath: string): Promise<void> {
    const writeStream = createWriteStream(filePath)
    await pipeline(stream, writeStream)
  }

  private async generateThumbnail(filePath: string): Promise<string> {
    // This would require an image processing library like sharp
    // For now, we'll return the original path
    logger.info('Thumbnail generation not implemented yet')
    return filePath
  }

  private async compressFile(filePath: string): Promise<string> {
    // This would require an image processing library like sharp
    // For now, we'll return the original path
    logger.info('File compression not implemented yet')
    return filePath
  }

  private getFileInfo(fileRecord: any): FileInfo {
    return {
      id: fileRecord.id,
      originalName: fileRecord.originalName,
      filename: fileRecord.filename,
      path: fileRecord.path,
      size: fileRecord.size,
      mimeType: fileRecord.mimeType,
      extension: fileRecord.extension,
      hash: fileRecord.hash,
      metadata: fileRecord.metadata,
      uploadedBy: fileRecord.uploadedBy,
      createdAt: fileRecord.createdAt
    }
  }

  async getFile(id: string): Promise<FileInfo | null> {
    const fileRecord = await this.prisma.file.findUnique({
      where: { id }
    })

    if (!fileRecord) {
      return null
    }

    return this.getFileInfo(fileRecord)
  }

  async getFileStream(id: string): Promise<any> {
    const fileInfo = await this.getFile(id)
    if (!fileInfo) {
      throw new Error('File not found')
    }

    if (!existsSync(fileInfo.path)) {
      throw new Error('File not found on disk')
    }

    return createReadStream(fileInfo.path)
  }

  async queryFiles(query: FileQuery): Promise<FileInfo[]> {
    const where: any = {}

    if (query.uploadedBy) {
      where.uploadedBy = query.uploadedBy
    }

    if (query.mimeType) {
      where.mimeType = query.mimeType
    }

    if (query.extension) {
      where.extension = query.extension
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {}
      if (query.startDate) {
        where.createdAt.gte = query.startDate
      }
      if (query.endDate) {
        where.createdAt.lte = query.endDate
      }
    }

    const files = await this.prisma.file.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: query.limit || 100,
      skip: query.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return files.map(file => this.getFileInfo(file))
  }

  async deleteFile(id: string): Promise<void> {
    const fileRecord = await this.prisma.file.findUnique({
      where: { id }
    })

    if (!fileRecord) {
      throw new Error('File not found')
    }

    // Delete file from disk
    if (existsSync(fileRecord.path)) {
      unlinkSync(fileRecord.path)
    }

    // Delete from database
    await this.prisma.file.delete({
      where: { id }
    })

    logger.info(`File deleted: ${fileRecord.filename}`)
  }

  async getFileStats(): Promise<any> {
    const totalFiles = await this.prisma.file.count()
    const totalSize = await this.prisma.file.aggregate({
      _sum: {
        size: true
      }
    })

    const fileTypes = await this.prisma.file.groupBy({
      by: ['mimeType'],
      _count: {
        mimeType: true
      },
      _sum: {
        size: true
      }
    })

    const recentUploads = await this.prisma.file.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    return {
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      fileTypes: fileTypes.map(type => ({
        mimeType: type.mimeType,
        count: type._count.mimeType,
        size: type._sum.size
      })),
      recentUploads: recentUploads.map(file => this.getFileInfo(file))
    }
  }

  async cleanupOrphanedFiles(): Promise<number> {
    const files = await this.prisma.file.findMany()
    let deletedCount = 0

    for (const file of files) {
      if (!existsSync(file.path)) {
        await this.prisma.file.delete({
          where: { id: file.id }
        })
        deletedCount++
      }
    }

    logger.info(`Cleaned up ${deletedCount} orphaned file records`)
    return deletedCount
  }

  async exportFileList(format: 'json' | 'csv' = 'json'): Promise<string> {
    const files = await this.prisma.file.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    if (format === 'csv') {
      return this.convertToCSV(files)
    }

    return JSON.stringify(files.map(file => this.getFileInfo(file)), null, 2)
  }

  private convertToCSV(files: any[]): string {
    if (files.length === 0) {
      return ''
    }

    const headers = [
      'ID',
      'Original Name',
      'Filename',
      'Size',
      'MIME Type',
      'Extension',
      'Hash',
      'Uploaded By',
      'Uploaded At',
      'Metadata'
    ]

    const csvRows = [headers.join(',')]

    for (const file of files) {
      const row = [
        file.id,
        `"${file.originalName}"`,
        `"${file.filename}"`,
        file.size,
        `"${file.mimeType}"`,
        `"${file.extension}"`,
        `"${file.hash}"`,
        `"${file.user?.email || ''}"`,
        file.createdAt.toISOString(),
        `"${JSON.stringify(file.metadata || {}).replace(/"/g, '""')}"`
      ]
      csvRows.push(row.join(','))
    }

    return csvRows.join('\n')
  }
} 