import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'
import nodemailer from 'nodemailer'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { compile } from 'handlebars'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text?: string
  variables: string[]
}

export interface EmailMessage {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  html?: string
  text?: string
  attachments?: EmailAttachment[]
  template?: string
  templateData?: Record<string, any>
  priority?: 'low' | 'normal' | 'high'
  scheduledAt?: Date
}

export interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType?: string
}

export interface EmailDeliveryStatus {
  id: string
  messageId: string
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  error?: string
  sentAt?: Date
  deliveredAt?: Date
  attempts: number
  maxAttempts: number
}

export class EmailService {
  private static instance: EmailService
  private prisma: PrismaClient
  private transporter: nodemailer.Transporter
  private templates: Map<string, EmailTemplate> = new Map()
  private isInitialized: boolean = false

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): EmailService {
    if (!EmailService.instance && prisma) {
      EmailService.instance = new EmailService(prisma)
    }
    return EmailService.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // Create transporter
    this.transporter = nodemailer.createTransporter({
      host: config.EMAIL_SMTP_HOST,
      port: config.EMAIL_SMTP_PORT,
      secure: config.EMAIL_SMTP_SECURE,
      auth: {
        user: config.EMAIL_SMTP_USER,
        pass: config.EMAIL_SMTP_PASS
      }
    })

    // Load email templates
    await this.loadTemplates()

    // Verify connection
    await this.transporter.verify()

    this.isInitialized = true
    logger.info('Email service initialized successfully')
  }

  private async loadTemplates(): Promise<void> {
    const templatesDir = join(__dirname, '../templates/email')
    
    if (!existsSync(templatesDir)) {
      logger.warn('Email templates directory not found')
      return
    }

    // Load built-in templates
    const builtInTemplates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to {{appName}}',
        html: `
          <h1>Welcome to {{appName}}!</h1>
          <p>Hello {{userName}},</p>
          <p>Thank you for joining {{appName}}. We're excited to have you on board!</p>
          <p>Your account has been created successfully.</p>
          <p>Best regards,<br>The {{appName}} Team</p>
        `,
        text: `
          Welcome to {{appName}}!
          
          Hello {{userName}},
          
          Thank you for joining {{appName}}. We're excited to have you on board!
          
          Your account has been created successfully.
          
          Best regards,
          The {{appName}} Team
        `,
        variables: ['appName', 'userName']
      },
      {
        id: 'password_reset',
        name: 'Password Reset',
        subject: 'Password Reset Request - {{appName}}',
        html: `
          <h1>Password Reset Request</h1>
          <p>Hello {{userName}},</p>
          <p>You have requested to reset your password for {{appName}}.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="{{resetLink}}">Reset Password</a></p>
          <p>This link will expire in {{expiryHours}} hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The {{appName}} Team</p>
        `,
        text: `
          Password Reset Request
          
          Hello {{userName}},
          
          You have requested to reset your password for {{appName}}.
          
          Click the link below to reset your password:
          {{resetLink}}
          
          This link will expire in {{expiryHours}} hours.
          
          If you didn't request this, please ignore this email.
          
          Best regards,
          The {{appName}} Team
        `,
        variables: ['appName', 'userName', 'resetLink', 'expiryHours']
      },
      {
        id: 'notification',
        name: 'System Notification',
        subject: '{{subject}}',
        html: `
          <h1>{{title}}</h1>
          <p>{{message}}</p>
          {{#if actionUrl}}
          <p><a href="{{actionUrl}}">{{actionText}}</a></p>
          {{/if}}
          <p>Best regards,<br>The {{appName}} Team</p>
        `,
        text: `
          {{title}}
          
          {{message}}
          
          {{#if actionUrl}}
          {{actionText}}: {{actionUrl}}
          {{/if}}
          
          Best regards,
          The {{appName}} Team
        `,
        variables: ['subject', 'title', 'message', 'actionUrl', 'actionText', 'appName']
      }
    ]

    for (const template of builtInTemplates) {
      this.templates.set(template.id, template)
    }

    logger.info(`Loaded ${this.templates.size} email templates`)
  }

  async sendEmail(message: EmailMessage): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      let html = message.html
      let text = message.text

      // Use template if specified
      if (message.template && message.templateData) {
        const template = this.templates.get(message.template)
        if (!template) {
          throw new Error(`Email template '${message.template}' not found`)
        }

        const compiledHtml = compile(template.html)
        const compiledText = template.text ? compile(template.text) : null

        html = compiledHtml(message.templateData)
        text = compiledText ? compiledText(message.templateData) : undefined
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: config.EMAIL_FROM_ADDRESS,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject,
        html,
        text,
        attachments: message.attachments,
        priority: message.priority
      }

      const result = await this.transporter.sendMail(mailOptions)

      // Log email delivery
      await this.logEmailDelivery({
        messageId: result.messageId,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        template: message.template,
        status: 'sent',
        sentAt: new Date()
      })

      logger.info(`Email sent successfully: ${result.messageId}`)
      return result.messageId
    } catch (error) {
      logger.error('Failed to send email:', error)

      // Log failed delivery
      await this.logEmailDelivery({
        messageId: '',
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        template: message.template,
        status: 'failed',
        error: error.message
      })

      throw error
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<string> {
    return this.sendEmail({
      to: userEmail,
      template: 'welcome',
      templateData: {
        appName: config.APP_NAME,
        userName
      }
    })
  }

  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
  ): Promise<string> {
    const resetLink = `${config.APP_URL}/reset-password?token=${resetToken}`
    
    return this.sendEmail({
      to: userEmail,
      template: 'password_reset',
      templateData: {
        appName: config.APP_NAME,
        userName,
        resetLink,
        expiryHours: 24
      }
    })
  }

  async sendNotificationEmail(
    userEmail: string,
    subject: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<string> {
    return this.sendEmail({
      to: userEmail,
      template: 'notification',
      templateData: {
        subject,
        title,
        message,
        actionUrl,
        actionText,
        appName: config.APP_NAME
      }
    })
  }

  async sendBulkEmail(
    messages: EmailMessage[]
  ): Promise<{ success: string[], failed: string[] }> {
    const results = {
      success: [] as string[],
      failed: [] as string[]
    }

    for (const message of messages) {
      try {
        const messageId = await this.sendEmail(message)
        results.success.push(messageId)
      } catch (error) {
        results.failed.push(message.to as string)
        logger.error(`Failed to send bulk email to ${message.to}:`, error)
      }
    }

    return results
  }

  async scheduleEmail(
    message: EmailMessage,
    scheduledAt: Date
  ): Promise<string> {
    // Save to database for later processing
    const scheduledEmail = await this.prisma.scheduledEmail.create({
      data: {
        to: Array.isArray(message.to) ? message.to : [message.to],
        cc: message.cc ? (Array.isArray(message.cc) ? message.cc : [message.cc]) : [],
        bcc: message.bcc ? (Array.isArray(message.bcc) ? message.bcc : [message.bcc]) : [],
        subject: message.subject,
        html: message.html,
        text: message.text,
        template: message.template,
        templateData: message.templateData,
        priority: message.priority,
        scheduledAt
      }
    })

    logger.info(`Email scheduled for ${scheduledAt}: ${scheduledEmail.id}`)
    return scheduledEmail.id
  }

  async processScheduledEmails(): Promise<number> {
    const now = new Date()
    const scheduledEmails = await this.prisma.scheduledEmail.findMany({
      where: {
        scheduledAt: {
          lte: now
        },
        status: 'pending'
      }
    })

    let processedCount = 0

    for (const scheduledEmail of scheduledEmails) {
      try {
        await this.sendEmail({
          to: scheduledEmail.to,
          cc: scheduledEmail.cc.length > 0 ? scheduledEmail.cc : undefined,
          bcc: scheduledEmail.bcc.length > 0 ? scheduledEmail.bcc : undefined,
          subject: scheduledEmail.subject,
          html: scheduledEmail.html,
          text: scheduledEmail.text,
          template: scheduledEmail.template,
          templateData: scheduledEmail.templateData,
          priority: scheduledEmail.priority
        })

        await this.prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: { status: 'sent', sentAt: new Date() }
        })

        processedCount++
      } catch (error) {
        await this.prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: { 
            status: 'failed', 
            error: error.message,
            attempts: scheduledEmail.attempts + 1
          }
        })

        logger.error(`Failed to process scheduled email ${scheduledEmail.id}:`, error)
      }
    }

    logger.info(`Processed ${processedCount} scheduled emails`)
    return processedCount
  }

  private async logEmailDelivery(data: {
    messageId: string
    to: string[]
    subject: string
    template?: string
    status: string
    sentAt?: Date
    error?: string
  }): Promise<void> {
    try {
      await this.prisma.emailDelivery.create({
        data: {
          messageId: data.messageId,
          to: data.to,
          subject: data.subject,
          template: data.template,
          status: data.status,
          sentAt: data.sentAt,
          error: data.error
        }
      })
    } catch (error) {
      logger.error('Failed to log email delivery:', error)
    }
  }

  async getEmailStats(days: number = 30): Promise<any> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const stats = await this.prisma.emailDelivery.groupBy({
      by: ['status'],
      where: {
        sentAt: {
          gte: startDate
        }
      },
      _count: {
        status: true
      }
    })

    const totalEmails = await this.prisma.emailDelivery.count({
      where: {
        sentAt: {
          gte: startDate
        }
      }
    })

    const templates = await this.prisma.emailDelivery.groupBy({
      by: ['template'],
      where: {
        sentAt: {
          gte: startDate
        },
        template: {
          not: null
        }
      },
      _count: {
        template: true
      }
    })

    return {
      period: `${days} days`,
      totalEmails,
      status: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status
        return acc
      }, {} as Record<string, number>),
      templates: templates.reduce((acc, template) => {
        if (template.template) {
          acc[template.template] = template._count.template
        }
        return acc
      }, {} as Record<string, number>)
    }
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.templates.values())
  }

  async addTemplate(template: EmailTemplate): Promise<void> {
    this.templates.set(template.id, template)
    logger.info(`Added email template: ${template.name}`)
  }

  async removeTemplate(templateId: string): Promise<void> {
    this.templates.delete(templateId)
    logger.info(`Removed email template: ${templateId}`)
  }
} 