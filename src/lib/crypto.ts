import crypto from 'crypto';

const SECRET_KEY = 'youtube-subtitle-tool';

const getEncryptionKey = (): Buffer => {
  // Derive a 256-bit key from the SECRET_KEY using SHA-256
  return crypto.createHash('sha256').update(SECRET_KEY).digest();
};

export function encryptApiKey(apiKey: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(apiKey, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Return format: iv:encryptedData (base64 encoded)
    return `${iv.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptApiKey(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivBase64, encrypted] = parts;
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt API key');
  }
}