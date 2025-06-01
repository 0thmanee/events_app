import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

class QRCodeService {
  constructor() {
    this.checkedInEvents = new Set();
  }

  // Generate QR code data for event check-in
  async generateEventQRCode(event, userProfile) {
    try {
      const qrData = {
        eventId: event.id,
        userId: userProfile.id,
        timestamp: Date.now(),
        checkInType: 'event_attendance',
        eventTitle: event.title,
        userName: userProfile.nickname,
        // Add security hash to prevent tampering
        hash: await this.generateSecurityHash(event.id, userProfile.id)
      };

      return JSON.stringify(qrData);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw error;
    }
  }

  // Generate admin QR code for event validation
  async generateAdminQRCode(event) {
    try {
      const qrData = {
        eventId: event.id,
        type: 'admin_checkin',
        eventTitle: event.title,
        timestamp: Date.now(),
        adminValidation: true,
        hash: await this.generateSecurityHash(event.id, 'admin')
      };

      return JSON.stringify(qrData);
    } catch (error) {
      console.error('Failed to generate admin QR code:', error);
      throw error;
    }
  }

  // Validate scanned QR code data
  async validateQRCode(qrCodeData) {
    try {
      const data = JSON.parse(qrCodeData);
      
      // Validate required fields
      if (!data.eventId || !data.timestamp || !data.hash) {
        throw new Error('Invalid QR code format');
      }

      // Check if QR code is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - data.timestamp > maxAge) {
        throw new Error('QR code has expired');
      }

      // Verify security hash
      const expectedHash = await this.generateSecurityHash(
        data.eventId, 
        data.userId || 'admin'
      );
      
      if (data.hash !== expectedHash) {
        throw new Error('Invalid QR code security hash');
      }

      return {
        valid: true,
        data: data
      };
    } catch (error) {
      console.error('QR code validation failed:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Process check-in from scanned QR code
  async processCheckIn(qrData, scannerUserProfile) {
    try {
      const validation = await this.validateQRCode(qrData);
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const data = validation.data;
      
      // Check if already checked in
      const checkInKey = `${data.eventId}_${data.userId || scannerUserProfile.id}`;
      if (this.checkedInEvents.has(checkInKey)) {
        throw new Error('Already checked in to this event');
      }

      // Record check-in
      await this.recordCheckIn(data, scannerUserProfile);
      this.checkedInEvents.add(checkInKey);

      return {
        success: true,
        eventId: data.eventId,
        userId: data.userId || scannerUserProfile.id,
        checkInTime: new Date(),
        eventTitle: data.eventTitle
      };
    } catch (error) {
      console.error('Check-in processing failed:', error);
      throw error;
    }
  }

  // Record check-in locally (will sync with backend later)
  async recordCheckIn(qrData, scannerProfile) {
    try {
      const checkInRecord = {
        eventId: qrData.eventId,
        userId: qrData.userId || scannerProfile.id,
        checkInTime: new Date().toISOString(),
        eventTitle: qrData.eventTitle,
        scannerName: scannerProfile.nickname,
        timestamp: Date.now()
      };

      // Store locally for offline capability
      const stored = await AsyncStorage.getItem('pendingCheckIns') || '[]';
      const checkIns = JSON.parse(stored);
      checkIns.push(checkInRecord);
      
      await AsyncStorage.setItem('pendingCheckIns', JSON.stringify(checkIns));
      
      console.log('✅ Check-in recorded locally:', checkInRecord);
      
      // TODO: Sync with backend API when available
      // await this.syncCheckInWithBackend(checkInRecord);
      
    } catch (error) {
      console.error('Failed to record check-in:', error);
      throw error;
    }
  }

  // Get user's check-in history
  async getCheckInHistory(userId) {
    try {
      const stored = await AsyncStorage.getItem('pendingCheckIns') || '[]';
      const checkIns = JSON.parse(stored);
      
      return checkIns
        .filter(checkIn => checkIn.userId === userId)
        .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
    } catch (error) {
      console.error('Failed to get check-in history:', error);
      return [];
    }
  }

  // Generate security hash for QR code validation
  async generateSecurityHash(eventId, userId) {
    try {
      const secretKey = await this.getOrCreateSecretKey();
      const dataToHash = `${eventId}_${userId}_${secretKey}`;
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        dataToHash
      );
    } catch (error) {
      console.error('Failed to generate security hash:', error);
      return 'fallback_hash';
    }
  }

  // Get or create secret key for security
  async getOrCreateSecretKey() {
    try {
      let secretKey = await AsyncStorage.getItem('qr_secret_key');
      
      if (!secretKey) {
        // Generate new secret key
        secretKey = await Crypto.getRandomBytesAsync(32).then(bytes => 
          Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
        );
        await AsyncStorage.setItem('qr_secret_key', secretKey);
      }
      
      return secretKey;
    } catch (error) {
      console.error('Failed to get/create secret key:', error);
      return 'default_fallback_key';
    }
  }

  // Clear check-in cache (for testing or reset)
  async clearCheckInCache() {
    try {
      this.checkedInEvents.clear();
      await AsyncStorage.removeItem('pendingCheckIns');
      console.log('✅ Check-in cache cleared');
    } catch (error) {
      console.error('Failed to clear check-in cache:', error);
    }
  }

  // Get pending check-ins for sync
  async getPendingCheckIns() {
    try {
      const stored = await AsyncStorage.getItem('pendingCheckIns') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get pending check-ins:', error);
      return [];
    }
  }

  // Mark check-ins as synced
  async markCheckInsAsSynced(syncedCheckIns) {
    try {
      const stored = await AsyncStorage.getItem('pendingCheckIns') || '[]';
      const checkIns = JSON.parse(stored);
      
      // Remove synced check-ins
      const syncedIds = syncedCheckIns.map(ci => `${ci.eventId}_${ci.userId}_${ci.timestamp}`);
      const remaining = checkIns.filter(ci => 
        !syncedIds.includes(`${ci.eventId}_${ci.userId}_${ci.timestamp}`)
      );
      
      await AsyncStorage.setItem('pendingCheckIns', JSON.stringify(remaining));
      console.log(`✅ ${syncedCheckIns.length} check-ins marked as synced`);
    } catch (error) {
      console.error('Failed to mark check-ins as synced:', error);
    }
  }

  // Generate mock event check-in statistics
  async getEventCheckInStats(eventId) {
    try {
      const checkIns = await this.getPendingCheckIns();
      const eventCheckIns = checkIns.filter(ci => ci.eventId === eventId);
      
      return {
        totalCheckIns: eventCheckIns.length,
        uniqueUsers: new Set(eventCheckIns.map(ci => ci.userId)).size,
        lastCheckIn: eventCheckIns.length > 0 ? 
          Math.max(...eventCheckIns.map(ci => new Date(ci.checkInTime).getTime())) : null,
        checkInsByHour: this.groupCheckInsByHour(eventCheckIns)
      };
    } catch (error) {
      console.error('Failed to get check-in stats:', error);
      return {
        totalCheckIns: 0,
        uniqueUsers: 0,
        lastCheckIn: null,
        checkInsByHour: {}
      };
    }
  }

  // Helper to group check-ins by hour
  groupCheckInsByHour(checkIns) {
    const grouped = {};
    
    checkIns.forEach(checkIn => {
      const hour = new Date(checkIn.checkInTime).getHours();
      grouped[hour] = (grouped[hour] || 0) + 1;
    });
    
    return grouped;
  }
}

export default new QRCodeService(); 