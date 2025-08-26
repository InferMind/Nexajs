const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class FileService {
  constructor() {
    this.allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown'
    ];
    
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default
  }

  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!this.allowedTypes.includes(file.mimetype)) {
      errors.push('Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async extractTextFromFile(file) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const { buffer, mimetype } = file;
      
      switch (mimetype) {
        case 'application/pdf':
          return await this.extractFromPDF(buffer);
        
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.extractFromWord(buffer);
        
        case 'text/plain':
        case 'text/markdown':
          return this.extractFromText(buffer);
        
        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  }

  async extractFromPDF(buffer) {
    try {
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text.trim();
      
      if (!text || text.length < 10) {
        throw new Error('PDF appears to be empty or contains no readable text');
      }
      
      return text;
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  async extractFromWord(buffer) {
    try {
      const docData = await mammoth.extractRawText({ buffer });
      const text = docData.value.trim();
      
      if (!text || text.length < 10) {
        throw new Error('Document appears to be empty or contains no readable text');
      }
      
      return text;
    } catch (error) {
      throw new Error(`Word document extraction failed: ${error.message}`);
    }
  }

  extractFromText(buffer) {
    try {
      const text = buffer.toString('utf-8').trim();
      
      if (!text || text.length < 10) {
        throw new Error('Text file appears to be empty');
      }
      
      return text;
    } catch (error) {
      throw new Error(`Text extraction failed: ${error.message}`);
    }
  }

  getFileInfo(file) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size)
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Clean and prepare text for AI processing
  cleanTextForAI(text, maxLength = 4000) {
    // Remove excessive whitespace
    let cleaned = text.replace(/\s+/g, ' ').trim();
    
    // Remove special characters that might interfere with AI processing
    cleaned = cleaned.replace(/[^\w\s.,!?;:()\-"']/g, ' ');
    
    // Truncate if too long
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength) + '...';
    }
    
    return cleaned;
  }

  // Extract metadata from different file types
  async extractMetadata(file) {
    const metadata = {
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    try {
      switch (file.mimetype) {
        case 'application/pdf':
          const pdfData = await pdfParse(file.buffer);
          metadata.pages = pdfData.numpages;
          metadata.info = pdfData.info;
          break;
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          // For Word docs, we could extract more metadata if needed
          metadata.wordCount = (await mammoth.extractRawText({ buffer: file.buffer })).value.split(/\s+/).length;
          break;
        
        default:
          // For text files, count words and lines
          const text = file.buffer.toString('utf-8');
          metadata.wordCount = text.split(/\s+/).length;
          metadata.lineCount = text.split('\n').length;
      }
    } catch (error) {
      console.warn('Could not extract metadata:', error.message);
    }

    return metadata;
  }
}

module.exports = new FileService();