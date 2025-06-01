import { View, Text, Pressable, StatusBar, Alert, Modal, Dimensions, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { 
  ArrowLeft,
  QrCode,
  Camera as CameraIcon,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  MapPin,
  Share,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  Calendar
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeService from '../services/QRCodeService';
import ApiService from '../services/ApiService';
import { 
  ProfessionalBackground, 
  IconLoadingState,
  DataLoadingOverlay 
} from '../components/LoadingComponents';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// QR Code Display Component
const QRCodeDisplay = ({ qrData, event, userProfile }) => {
  const pulseAnim = useSharedValue(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleShare = async () => {
    try {
      // Implementation for sharing QR code
      Alert.alert('QR Code', 'QR code sharing functionality will be implemented');
    } catch (error) {
      console.error('Failed to share QR code:', error);
    }
  };

  return (
    <View style={styles.qrContainer}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.1)', 'transparent']}
        style={styles.qrGradient}
      />
      
      <View style={styles.qrHeader}>
        <Text style={styles.qrTitle}>Your Check-in QR Code</Text>
        <Text style={styles.qrSubtitle}>Show this to event organizers</Text>
      </View>

      <Animated.View style={[styles.qrCodeWrapper, animatedStyle]}>
        {isVisible ? (
          <QRCode
            value={qrData}
            size={200}
            color="#1f2937"
            backgroundColor="#ffffff"
            logoSize={30}
            logoBackgroundColor="transparent"
          />
        ) : (
          <View style={styles.hiddenQRCode}>
            <EyeOff color="#6b7280" size={48} strokeWidth={1.5} />
            <Text style={styles.hiddenText}>QR Code Hidden</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.qrActions}>
        <Pressable style={styles.qrActionButton} onPress={toggleVisibility}>
          {isVisible ? (
            <EyeOff color="#6b7280" size={20} strokeWidth={1.5} />
          ) : (
            <Eye color="#6b7280" size={20} strokeWidth={1.5} />
          )}
          <Text style={styles.qrActionText}>
            {isVisible ? 'Hide' : 'Show'}
          </Text>
        </Pressable>

        <Pressable style={styles.qrActionButton} onPress={handleShare}>
          <Share color="#6b7280" size={20} strokeWidth={1.5} />
          <Text style={styles.qrActionText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Clock color="#6b7280" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetail}>
            <MapPin color="#6b7280" size={14} strokeWidth={1.5} />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Check-in Instructions</Text>
        <Text style={styles.instructionsText}>
          1. Show this QR code to event staff{'\n'}
          2. Wait for confirmation{'\n'}
          3. Enjoy the event!
        </Text>
      </View>
    </View>
  );
};

// QR Scanner Component
const QRScanner = ({ onScan, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    
    setScanned(true);
    onScan(data);
    
    // Reset scanner after 2 seconds
    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  if (!permission) {
    return (
      <View style={styles.scannerContainer}>
        <IconLoadingState 
          icon={CameraIcon}
          message="Requesting Camera Permission"
          subMessage="Please allow camera access to scan QR codes"
        />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.scannerContainer}>
        <IconLoadingState 
          icon={AlertCircle}
          message="Camera Permission Denied"
          subMessage="Please enable camera access in settings"
        />
        <Pressable 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={isFlashOn}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      <View style={styles.scannerOverlay}>
        <View style={styles.scannerHeader}>
          <Pressable style={styles.scannerCloseButton} onPress={onClose}>
            <ArrowLeft color="#ffffff" size={24} strokeWidth={2} />
          </Pressable>
          <Text style={styles.scannerTitle}>Scan QR Code</Text>
          <Pressable style={styles.flashButton} onPress={toggleFlash}>
            <Zap color={isFlashOn ? "#fbbf24" : "#ffffff"} size={24} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.scanFrame}>
          <View style={styles.scanCorner} />
          <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
          <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
          <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
        </View>

        <View style={styles.scannerInstructions}>
          <Text style={styles.scannerInstructionText}>
            Position the QR code within the frame
          </Text>
        </View>
      </View>

      {scanned && (
        <Animated.View 
          entering={FadeInUp.duration(300)}
          style={styles.scannedIndicator}
        >
          <CheckCircle color="#10b981" size={48} strokeWidth={2} />
          <Text style={styles.scannedText}>QR Code Scanned!</Text>
        </Animated.View>
      )}
    </View>
  );
};

// Check-in Result Component
const CheckInResult = ({ result, onClose }) => {
  const scaleAnim = useSharedValue(0);

  useEffect(() => {
    scaleAnim.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.resultModal}>
        <Animated.View style={[styles.resultContainer, animatedStyle]}>
          <LinearGradient
            colors={result.success ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
            style={styles.resultHeader}
          >
            {result.success ? (
              <CheckCircle color="#ffffff" size={48} strokeWidth={2} />
            ) : (
              <AlertCircle color="#ffffff" size={48} strokeWidth={2} />
            )}
            <Text style={styles.resultTitle}>
              {result.success ? 'Check-in Successful!' : 'Check-in Failed'}
            </Text>
          </LinearGradient>

          <View style={styles.resultContent}>
            {result.success ? (
              <>
                <Text style={styles.resultMessage}>
                  Welcome to {result.eventTitle}!
                </Text>
                <View style={styles.resultDetails}>
                  <Text style={styles.resultDetail}>
                    Check-in time: {new Date(result.checkInTime).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.resultDetail}>
                    User: {result.userName || 'Student'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.resultMessage}>
                {result.error || 'Unable to process check-in'}
              </Text>
            )}
          </View>

          <Pressable style={styles.resultButton} onPress={onClose}>
            <Text style={styles.resultButtonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Main Check-in Screen
export default function QRCheckIn() {
  const router = useRouter();
  const { eventId, mode = 'generate' } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadEventAndUser();
  }, []);

  const loadEventAndUser = async () => {
    try {
      setLoading(true);
      
      // Always load user profile
      const userProfileData = await ApiService.getUserProfile();
      setUserProfile(userProfileData);

      // Only load event details if eventId is provided and mode is generate
      if (eventId && eventId !== 'undefined' && mode === 'generate') {
        const eventData = await ApiService.getEventById(eventId);
        setEvent(eventData);

        // Generate QR code for this specific event
        const qrCodeData = await QRCodeService.generateEventQRCode(eventData, userProfileData);
        setQrData(qrCodeData);
      } else if (mode === 'scan') {
        // In scan mode, we don't need a specific event
        setEvent(null);
        setQrData(null);
      } else {
        // No valid eventId provided for generate mode
        setError('No event selected for QR code generation');
        return;
      }

    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleScanQR = async (qrCodeData) => {
    try {
      setShowScanner(false);
      
      // Process the scanned QR code
      const result = await QRCodeService.processCheckIn(qrCodeData, userProfile);
      setCheckInResult(result);
      
    } catch (error) {
      console.error('QR scan processing failed:', error);
      setCheckInResult({
        success: false,
        error: error.message
      });
    }
  };

  const toggleMode = () => {
    if (mode === 'generate') {
      setShowScanner(true);
    } else {
      router.replace(`/qr-check-in?eventId=${eventId}&mode=generate`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <DataLoadingOverlay 
          visible={true}
          message="Loading Check-in"
          subMessage="Preparing QR code system"
          icon={QrCode}
        />
      </View>
    );
  }

  // Show error state
  if (error || (!event && mode === 'generate')) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <IconLoadingState 
          icon={AlertCircle}
          message="Unable to Load Event"
          subMessage={error || "No event selected for QR generation"}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ProfessionalBackground />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color="#9ca3af" size={20} strokeWidth={1.5} />
          </Pressable>
          <Text style={styles.headerTitle}>QR Check-in</Text>
          <Pressable style={styles.modeButton} onPress={toggleMode}>
            {mode === 'generate' ? (
              <CameraIcon color="#6366f1" size={20} strokeWidth={1.5} />
            ) : (
              <QrCode color="#6366f1" size={20} strokeWidth={1.5} />
            )}
          </Pressable>
        </Animated.View>

        {/* Content */}
        <Animated.View 
          entering={FadeInUp.delay(200)} 
          style={styles.content}
        >
          {mode === 'generate' && qrData && event ? (
            <QRCodeDisplay 
              qrData={qrData} 
              event={event} 
              userProfile={userProfile} 
            />
          ) : (
            <View style={styles.scannerPrompt}>
              <QrCode color="#6366f1" size={64} strokeWidth={1.5} />
              <Text style={styles.promptTitle}>Scan QR Code</Text>
              <Text style={styles.promptText}>
                {mode === 'scan' 
                  ? 'Tap the camera button to scan event QR codes'
                  : 'Select an event to generate a QR code'
                }
              </Text>
              
              <View style={styles.scannerActions}>
                <Pressable style={styles.scanButton} onPress={() => setShowScanner(true)}>
                  <CameraIcon color="#ffffff" size={20} strokeWidth={1.5} />
                  <Text style={styles.scanButtonText}>Open Scanner</Text>
                </Pressable>
                
                {mode === 'scan' && (
                  <Pressable 
                    style={styles.eventsButton} 
                    onPress={() => router.push('/events')}
                  >
                    <Calendar color="#6366f1" size={20} strokeWidth={1.5} />
                    <Text style={styles.eventsButtonText}>View Events</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>

      {/* QR Scanner Modal */}
      {showScanner && (
        <Modal visible={true} animationType="slide">
          <QRScanner 
            onScan={handleScanQR}
            onClose={() => setShowScanner(false)}
          />
        </Modal>
      )}

      {/* Check-in Result Modal */}
      {checkInResult && (
        <CheckInResult
          result={checkInResult}
          onClose={() => setCheckInResult(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a2332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderRadius: 16,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hiddenQRCode: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  hiddenText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  qrActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a2332',
    borderRadius: 12,
  },
  qrActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  eventInfo: {
    width: '100%',
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  instructionsCard: {
    width: '100%',
    backgroundColor: '#1a2332',
    borderRadius: 16,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  scannerPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  promptText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  scannerActions: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  eventsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  eventsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scannerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#ffffff',
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  scanCornerTopRight: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  scanCornerBottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  scanCornerBottomRight: {
    top: undefined,
    left: undefined,
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scannerInstructions: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scannerInstructionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scannedIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -75,
    marginTop: -50,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  resultModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  resultContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#1a2332',
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
  },
  resultContent: {
    padding: 20,
  },
  resultMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  resultDetails: {
    gap: 8,
  },
  resultDetail: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  resultButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    alignItems: 'center',
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  permissionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
}); 