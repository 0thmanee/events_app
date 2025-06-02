import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Calendar,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  Timer,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ApiService from '../services/ApiService';

const colors = {
  primaryBg: '#F5F5F5',
  secondaryBg: '#EAEAEA',
  primaryText: '#333333',
  secondaryText: '#555555',
  accent: '#3EB489',
  highlight: '#E1C3AD',
  error: '#D9534F',
  white: '#FFFFFF',
  lightAccent: '#3EB48920',
  cardBorder: '#E0E0E0',
  shadow: '#00000015',
  success: '#059669',
  warning: '#d97706',
  info: '#2563eb',
  muted: '#9ca3af'
};

const FeedbackPage = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [event, setEvent] = useState(null);
  const [eventsNeedingFeedback, setEventsNeedingFeedback] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Feedback form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  useEffect(() => {
    if (eventId && eventsNeedingFeedback.length > 0) {
      const specificEvent = eventsNeedingFeedback.find(e => e._id === eventId);
      if (specificEvent) {
        setSelectedEvent(specificEvent);
        setShowFeedbackModal(true);
      }
    }
  }, [eventId, eventsNeedingFeedback]);

  const loadFeedbackData = async () => {
    try {
      setLoading(true);
      const [pendingEvents, availableEvents] = await Promise.all([
        ApiService.getEventsNeedingFeedback(),
        ApiService.getEventsAvailableForFeedback()
      ]);
      
      // Combine and deduplicate events
      const allEvents = [...pendingEvents, ...availableEvents];
      const uniqueEvents = allEvents.reduce((acc, event) => {
        if (!acc.find(e => e._id === event._id)) {
          acc.push(event);
        }
        return acc;
      }, []);
      
      setEventsNeedingFeedback(uniqueEvents);
    } catch (error) {
      console.error('Failed to load feedback data:', error);
      Alert.alert('Error', 'Failed to load events for feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedbackData();
    setRefreshing(false);
  };

  const openFeedbackModal = (event) => {
    setSelectedEvent(event);
    setRating(0);
    setComment('');
    setFeedbackSubmitted(false);
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedEvent(null);
    setRating(0);
    setComment('');
    setFeedbackSubmitted(false);
  };

  const submitFeedback = async () => {
    if (!selectedEvent) return;
    
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please select a rating between 1-5 stars');
      return;
    }
    
    if (comment.trim().length < 10) {
      Alert.alert('Comment Too Short', 'Please provide at least 10 characters of feedback');
      return;
    }

    try {
      setSubmitting(true);
      
      const feedbackData = {
        rating,
        comment: comment.trim()
      };
      
      const response = await ApiService.submitEventFeedback(selectedEvent._id, feedbackData);
      
      setFeedbackSubmitted(true);
      
      // Remove the event from the list
      setEventsNeedingFeedback(prev => 
        prev.filter(e => e._id !== selectedEvent._id)
      );
      
      // Show success and close modal after delay
      setTimeout(() => {
        closeFeedbackModal();
        Alert.alert(
          'Feedback Submitted!', 
          `Thank you for your feedback! You earned ${response.pointsEarned || 5} points.`,
          [{ text: 'OK' }]
        );
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', error.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeUntilFeedbackAvailable = (event) => {
    if (!event.feedbackAvailableTime) return null;
    
    const now = new Date();
    const availableTime = new Date(event.feedbackAvailableTime);
    const timeDiff = availableTime - now;
    
    if (timeDiff <= 0) return null;
    
    const minutes = Math.ceil(timeDiff / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.ceil(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const canGiveFeedbackNow = (event) => {
    if (event.canGiveFeedbackNow !== undefined) {
      return event.canGiveFeedbackNow;
    }
    
    // Fallback check for events without explicit timing info
    const now = new Date();
    const eventTime = new Date(event.time);
    const eventEndTime = new Date(eventTime.getTime() + (event.expectedTime || 2) * 60 * 60 * 1000);
    const feedbackAvailableTime = new Date(eventEndTime.getTime() + 5 * 60 * 1000); // 5 minutes after event ends
    
    return now >= feedbackAvailableTime;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryBg }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ marginTop: 16, color: colors.secondaryText }}>
            Loading events for feedback...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryBg }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.secondaryBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <ArrowLeft color={colors.primaryText} size={20} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors.primaryText,
          }}>
            Event Feedback
          </Text>
          <Text style={{
            fontSize: 14,
            color: colors.secondaryText,
          }}>
            Share your experience
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={{ padding: 20 }}
      >
        {eventsNeedingFeedback.length === 0 ? (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <CheckCircle color={colors.success} size={64} strokeWidth={1.5} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.primaryText,
              marginTop: 16,
              textAlign: 'center',
            }}>
              All caught up!
            </Text>
            <Text style={{
              fontSize: 14,
              color: colors.secondaryText,
              marginTop: 8,
              textAlign: 'center',
            }}>
              You've provided feedback for all attended events.
            </Text>
          </View>
        ) : (
          <>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.primaryText,
              marginBottom: 16,
            }}>
              Events waiting for your feedback ({eventsNeedingFeedback.length})
            </Text>

            {eventsNeedingFeedback.map((event, index) => {
              const canFeedback = canGiveFeedbackNow(event);
              const timeLeft = getTimeUntilFeedbackAvailable(event);

              return (
                <Animated.View
                  key={event._id}
                  entering={FadeInDown.delay(index * 100)}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ padding: 20 }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 12,
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: colors.primaryText,
                          marginBottom: 4,
                        }}>
                          {event.title}
                        </Text>
                        <Text style={{
                          fontSize: 12,
                          color: colors.accent,
                          textTransform: 'uppercase',
                          fontWeight: '500',
                        }}>
                          {event.category}
                        </Text>
                      </View>
                      
                      {!canFeedback && timeLeft && (
                        <View style={{
                          backgroundColor: colors.warning + '15',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                          <Timer color={colors.warning} size={12} strokeWidth={2} />
                          <Text style={{
                            fontSize: 10,
                            color: colors.warning,
                            fontWeight: '600',
                            marginLeft: 4,
                          }}>
                            {timeLeft}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 16,
                      gap: 16,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Calendar color={colors.muted} size={14} strokeWidth={1.5} />
                        <Text style={{
                          fontSize: 12,
                          color: colors.secondaryText,
                          marginLeft: 4,
                        }}>
                          {formatEventDate(event.time)}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Clock color={colors.muted} size={14} strokeWidth={1.5} />
                        <Text style={{
                          fontSize: 12,
                          color: colors.secondaryText,
                          marginLeft: 4,
                        }}>
                          {formatEventTime(event.time)}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MapPin color={colors.muted} size={14} strokeWidth={1.5} />
                        <Text style={{
                          fontSize: 12,
                          color: colors.secondaryText,
                          marginLeft: 4,
                        }}>
                          {event.location}
                        </Text>
                      </View>
                    </View>

                    {!canFeedback ? (
                      <View style={{
                        backgroundColor: colors.warning + '10',
                        borderColor: colors.warning + '30',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <AlertCircle color={colors.warning} size={16} strokeWidth={2} />
                        <Text style={{
                          fontSize: 12,
                          color: colors.warning,
                          marginLeft: 8,
                          flex: 1,
                        }}>
                          Feedback will be available {timeLeft} after the event ends
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => openFeedbackModal(event)}
                        style={{
                          backgroundColor: colors.accent,
                          borderRadius: 8,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Star color={colors.white} size={16} strokeWidth={2} />
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: colors.white,
                          marginLeft: 8,
                        }}>
                          Give Feedback
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFeedbackModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryBg }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.white,
            borderBottomWidth: 1,
            borderBottomColor: colors.cardBorder,
          }}>
            <Pressable
              onPress={closeFeedbackModal}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.secondaryBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <ArrowLeft color={colors.primaryText} size={20} strokeWidth={2} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.primaryText,
              }}>
                Rate Your Experience
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.secondaryText,
              }}>
                {selectedEvent?.title}
              </Text>
            </View>
          </View>

          {feedbackSubmitted ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
            }}>
              <CheckCircle color={colors.success} size={64} strokeWidth={1.5} />
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.success,
                marginTop: 16,
                textAlign: 'center',
              }}>
                Feedback Submitted!
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.secondaryText,
                marginTop: 8,
                textAlign: 'center',
              }}>
                Thank you for helping us improve our events.
              </Text>
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
              {/* Rating Section */}
              <View style={{
                backgroundColor: colors.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.primaryText,
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  How would you rate this event?
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => setRating(star)}
                      style={{
                        padding: 8,
                      }}
                    >
                      <Star
                        color={star <= rating ? colors.warning : colors.muted}
                        fill={star <= rating ? colors.warning : 'transparent'}
                        size={32}
                        strokeWidth={2}
                      />
                    </Pressable>
                  ))}
                </View>
                
                {rating > 0 && (
                  <Text style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: colors.secondaryText,
                  }}>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </Text>
                )}
              </View>

              {/* Comment Section */}
              <View style={{
                backgroundColor: colors.white,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.primaryText,
                  marginBottom: 12,
                }}>
                  Tell us more about your experience
                </Text>
                
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 14,
                    color: colors.primaryText,
                    textAlignVertical: 'top',
                    minHeight: 120,
                  }}
                  placeholder="What did you like? What could be improved? (minimum 10 characters)"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={5}
                  value={comment}
                  onChangeText={setComment}
                  maxLength={500}
                />
                
                <Text style={{
                  fontSize: 12,
                  color: colors.muted,
                  textAlign: 'right',
                  marginTop: 8,
                }}>
                  {comment.length}/500 characters
                </Text>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={submitFeedback}
                disabled={submitting || rating === 0 || comment.trim().length < 10}
                style={{
                  backgroundColor: (submitting || rating === 0 || comment.trim().length < 10) 
                    ? colors.muted 
                    : colors.accent,
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Send color={colors.white} size={16} strokeWidth={2} />
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.white,
                      marginLeft: 8,
                    }}>
                      Submit Feedback
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default FeedbackPage; 