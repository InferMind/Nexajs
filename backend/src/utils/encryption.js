const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class EncryptionUtils {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
    this.ivLength = 16;
    this.saltRounds = 12;
  }

  // Hash password using bcrypt
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  // Compare password with hash
  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

  // Encrypt sensitive data
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, this.secretKey, iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData;
      
      const decipher = crypto.createDecipher(
        this.algorithm,
        this.secretKey,
        Buffer.from(iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  // Generate secure random token
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate API key
  generateApiKey() {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `nexa_${timestamp}_${randomBytes}`;
  }

  // Hash data using SHA-256
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Generate HMAC signature
  generateHMAC(data, secret = this.secretKey) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  // Verify HMAC signature
  verifyHMAC(data, signature, secret = this.secretKey) {
    const expectedSignature = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Generate password reset token
  generateResetToken() {
    const token = this.generateToken(32);
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    
    return {
      token,
      expires,
      hash: this.hash(token)
    };
  }

  // Verify password reset token
  verifyResetToken(token, hash, expires) {
    if (new Date() > new Date(expires)) {
      return { valid: false, reason: 'Token expired' };
    }

    if (this.hash(token) !== hash) {
      return { valid: false, reason: 'Invalid token' };
    }

    return { valid: true };
  }

  // Encrypt email addresses for privacy
  encryptEmail(email) {
    const [localPart, domain] = email.split('@');
    const encryptedLocal = this.hash(localPart).substring(0, 8);
    return `${encryptedLocal}@${domain}`;
  }

  // Generate session token
  generateSessionToken(userId) {
    const payload = {
      userId,
      timestamp: Date.now(),
      random: this.generateToken(16)
    };

    const data = JSON.stringify(payload);
    const signature = this.generateHMAC(data);

    return {
      token: Buffer.from(data).toString('base64'),
      signature
    };
  }

  // Verify session token
  verifySessionToken(token, signature) {
    try {
      const data = Buffer.from(token, 'base64').toString('utf8');
      
      if (!this.verifyHMAC(data, signature)) {
        return { valid: false, reason: 'Invalid signature' };
      }

      const payload = JSON.parse(data);
      const tokenAge = Date.now() - payload.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        return { valid: false, reason: 'Token expired' };
      }

      return { valid: true, userId: payload.userId };
    } catch (error) {
      return { valid: false, reason: 'Invalid token format' };
    }
  }

  // Mask sensitive data for logging
  maskSensitiveData(data) {
    const masked = { ...data };
    
    const sensitiveFields = [
      'password', 'token', 'apiKey', 'secret', 'key',
      'creditCard', 'ssn', 'phone'
    ];

    for (const field of sensitiveFields) {
      if (masked[field]) {
        masked[field] = '***MASKED***';
      }
    }

    // Mask email addresses
    if (masked.email) {
      const [local, domain] = masked.email.split('@');
      masked.email = `${local.substring(0, 2)}***@${domain}`;
    }

    return masked;
  }

  // Generate secure file upload token
  generateUploadToken(userId, filename) {
    const payload = {
      userId,
      filename,
      timestamp: Date.now(),
      expires: Date.now() + (15 * 60 * 1000) // 15 minutes
    };

    const data = JSON.stringify(payload);
    const signature = this.generateHMAC(data);

    return Buffer.from(JSON.stringify({ data, signature })).toString('base64');
  }

  // Verify file upload token
  verifyUploadToken(token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      const { data, signature } = decoded;

      if (!this.verifyHMAC(data, signature)) {
        return { valid: false, reason: 'Invalid signature' };
      }

      const payload = JSON.parse(data);

      if (Date.now() > payload.expires) {
        return { valid: false, reason: 'Token expired' };
      }

      return { 
        valid: true, 
        userId: payload.userId, 
        filename: payload.filename 
      };
    } catch (error) {
      return { valid: false, reason: 'Invalid token format' };
    }
  }
}

module.exports = new EncryptionUtils();