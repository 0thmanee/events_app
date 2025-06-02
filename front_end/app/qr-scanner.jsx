import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, Camera } from 'expo-camera';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { 
  ArrowLeft, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  Clock,
  AlertTriangle,
  Scan
} from 'lucide-react-native';
import ApiService from '../services/ApiService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color Palette
const colors = {
  primaryBg: '#F5F5F5',
  secondaryBg: '#EAEAEA',
  primaryText: '#333333',
  secondaryText: '#555555',
  accent: '#3EB489',
  white: '#FFFFFF',
  cardBorder: '#E0E0E0',
  success: '#059669',
  error: '#D9534F',
  warning: '#d97706',
  shadow: '#00000015',
};

export default function QRScanner() {
  const router = useRouter();
  const { eventId, mode } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [event, setEvent] = useState(null);
  const [lastScanResult, setLastScanResult] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    getCameraPermissions();
    if (eventId) {
      loadEventDetails();
    }
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const loadEventDetails = async () => {
    try {
      const eventData = await ApiService.getEventById(eventId);
      setEvent(eventData);
    } catch (error) {
      console.error('Failed to load event details:', error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || scanning) return;
    
    setScanned(true);
    setScanning(true);

    try {
      if (mode === 'staff') {
        // Staff scanning student QR codes
        await handleStaffScan(data);
      } else {
        // Student generating their own QR code
        await handleStudentScan(data);
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      Alert.alert('Scan Error', error.message || 'Failed to process QR code');
    } finally {
      setScanning(false);
      
      // Reset scanner after 2 seconds
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  const handleStaffScan = async (qrData) => {
    try {
      // Verify student registration
      const verificationResult = await ApiService.verifyStudentRegistration(eventId, qrData);
      
      if (verificationResult.registered) {
        // Student is registered, proceed with check-in
        const checkInResult = await ApiService.checkInStudentByQR(eventId, qrData);
        
        setLastScanResult({
          success: true,
          studentName: verificationResult.studentName,
          message: 'Student successfully checked in!',
          checkInTime: new Date().toLocaleTimeString(),
          alreadyCheckedIn: checkInResult.alreadyCheckedIn
        });

        Alert.alert(
          '✅ Check-in Successful',
          `${verificationResult.studentName} has been checked in to the event.`,
          [{ text: 'Continue Scanning', onPress: () => setScanned(false) }]
        );
      } else {
        // Student is not registered
        setLastScanResult({
          success: false,
          studentName: verificationResult.studentName || 'Unknown Student',
          message: 'Student is not registered for this event',
          reason: verificationResult.reason
        });

        Alert.alert(
          '❌ Registration Not Found',
          `${verificationResult.studentName || 'This student'} is not registered for this event.`,
          [
            { text: 'Try Again', onPress: () => setScanned(false) },
            { text: 'Manual Override', onPress: () => handleManualOverride(qrData) }
          ]
        );
      }
    } catch (error) {
      setLastScanResult({
        success: false,
        message: 'Failed to verify registration',
        error: error.message
      });
      throw error;
    }
  };

  const handleStudentScan = async (qrData) => {
    // Handle student QR code generation/validation
    Alert.alert('Student QR', 'Student QR functionality not implemented yet');
  };

  const handleManualOverride = (qrData) => {
    Alert.alert(
      'Manual Override',
      'Allow unregistered student to check in?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Allow Check-in', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.checkInStudentByQR(eventId, qrData, true); // Force check-in
              Alert.alert('Success', 'Student checked in with manual override');
              setScanned(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to check in student');
            }
          }
        }
      ]
    );
  };

  const resetScanner = () => {
    setScanned(false);
    setLastScanResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionDenied}>
            <Animated.View entering={FadeInDown.delay(200)} style={styles.permissionIcon}>
              <QrCode color={colors.error} size={64} strokeWidth={1.5} />
            </Animated.View>
            <Animated.Text entering={FadeInUp.delay(400)} style={styles.permissionTitle}>
              Camera Permission Required
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(600)} style={styles.permissionMessage}>
              To scan QR codes, please grant camera permission in your device settings.
            </Animated.Text>
            <Animated.View entering={FadeInUp.delay(800)}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft color={colors.white} size={20} strokeWidth={1.5} />
                <Text style={styles.backButtonText}>Go Back</Text>
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      />

      {/* Overlay */}
      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.white} size={24} strokeWidth={1.5} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {mode === 'staff' ? 'Staff Check-in' : 'QR Scanner'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {event?.title || 'Event Check-in'}
            </Text>
          </View>
          <Pressable style={styles.headerButton} onPress={resetScanner}>
            <Scan color={colors.white} size={24} strokeWidth={1.5} />
          </Pressable>
        </Animated.View>

        {/* Scanning Frame */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.scanningArea}>
          <View style={styles.scanningFrame}>
            {/* Corner borders */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Scanning line animation */}
            {!scanned && (
              <Animated.View style={styles.scanningLine} />
            )}
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.instructions}>
          <Text style={styles.instructionTitle}>
            {mode === 'staff' 
              ? 'Scan Student QR Code' 
              : 'Position QR Code in Frame'
            }
          </Text>
          <Text style={styles.instructionText}>
            {mode === 'staff'
              ? 'Point camera at student\'s event QR code to verify registration and check them in'
              : 'Center the QR code within the scanning frame'
            }
          </Text>
        </Animated.View>

        {/* Last Scan Result */}
        {lastScanResult && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.resultCard}>
            <View style={[
              styles.resultIcon, 
              { backgroundColor: lastScanResult.success ? colors.success + '20' : colors.error + '20' }
            ]}>
              {lastScanResult.success ? (
                <CheckCircle color={colors.success} size={24} strokeWidth={1.5} />
              ) : (
                <XCircle color={colors.error} size={24} strokeWidth={1.5} />
              )}
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultMessage}>{lastScanResult.message}</Text>
              {lastScanResult.studentName && (
                <Text style={styles.resultStudent}>{lastScanResult.studentName}</Text>
              )}
              {lastScanResult.checkInTime && (
                <Text style={styles.resultTime}>Checked in at {lastScanResult.checkInTime}</Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Status */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          {scanning ? (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>Processing QR Code...</Text>
            </View>
          ) : scanned ? (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>QR Code Scanned ✓</Text>
            </View>
          ) : (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>Ready to Scan</Text>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Scanning Area
  scanningArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  scanningFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.accent,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanningLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.8,
  },

  // Instructions
  instructions: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Result Card
  resultCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  resultStudent: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  resultTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statusCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Permission Denied
  permissionDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  permissionText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
}); 