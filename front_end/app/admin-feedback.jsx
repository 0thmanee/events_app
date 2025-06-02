import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Filter,
  BarChart3,
  Eye,
  Search,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ApiService from '../services/ApiService';
import AdminHeader from '../components/AdminHeader';

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

const AdminFeedbackDashboard = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: true });

  useEffect(() => {
    loadFeedbacks();
  }, [selectedRating]);

  const loadFeedbacks = async (page = 1, rating = selectedRating) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      
      const response = await ApiService.getAllFeedbacks(page, 20, null, rating);
      
      if (page === 1) {
        setFeedbacks(response.feedbacks || []);
      } else {
        setFeedbacks(prev => [...prev, ...(response.feedbacks || [])]);
      }
      
      setStats(response.stats);
      setPagination({
        page: response.pagination?.page || page,
        hasMore: response.pagination?.hasMore || false
      });
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
      Alert.alert('Error', 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedbacks(1);
    setRefreshing(false);
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating === selectedRating ? null : rating);
    setPagination({ page: 1, hasMore: true });
  };

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeFeedbackModal = () => {
    setSelectedFeedback(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const renderStarRating = (rating, size = 14) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            color={star <= rating ? colors.warning : colors.muted}
            fill={star <= rating ? colors.warning : 'transparent'}
            size={size}
            strokeWidth={1.5}
          />
        ))}
      </View>
    );
  };

  if (loading && feedbacks.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryBg }}>
        <AdminHeader title="Event Feedback" subtitle="Review participant feedback" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={{ marginTop: 16, color: colors.secondaryText }}>
            Loading feedback data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryBg }}>
      <AdminHeader title="Event Feedback" subtitle="Review participant feedback" />
      
      {/* Statistics Cards */}
      {stats && (
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 12,
        }}>
          <View style={{
            flex: 1,
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <MessageSquare color={colors.accent} size={16} strokeWidth={2} />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.accent,
                marginLeft: 6,
                textTransform: 'uppercase',
              }}>
                Total
              </Text>
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.primaryText,
            }}>
              {stats.totalFeedbacks}
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.secondaryText,
            }}>
              Feedbacks
            </Text>
          </View>

          <View style={{
            flex: 1,
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Star color={colors.warning} size={16} strokeWidth={2} />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.warning,
                marginLeft: 6,
                textTransform: 'uppercase',
              }}>
                Average
              </Text>
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.primaryText,
            }}>
              {stats.averageRating}
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.secondaryText,
            }}>
              Rating
            </Text>
          </View>
        </View>
      )}

      {/* Rating Filter */}
      <View style={{
        paddingHorizontal: 20,
        paddingBottom: 20,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.primaryText,
          marginBottom: 12,
        }}>
          Filter by Rating
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => handleRatingFilter(null)}
            style={{
              backgroundColor: selectedRating === null ? colors.accent : colors.white,
              borderColor: selectedRating === null ? colors.accent : colors.cardBorder,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: selectedRating === null ? colors.white : colors.secondaryText,
            }}>
              All
            </Text>
          </Pressable>
          
          {[5, 4, 3, 2, 1].map((rating) => (
            <Pressable
              key={rating}
              onPress={() => handleRatingFilter(rating)}
              style={{
                backgroundColor: selectedRating === rating ? colors.accent : colors.white,
                borderColor: selectedRating === rating ? colors.accent : colors.cardBorder,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Star
                color={selectedRating === rating ? colors.white : colors.warning}
                fill={selectedRating === rating ? colors.white : colors.warning}
                size={12}
                strokeWidth={2}
              />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: selectedRating === rating ? colors.white : colors.secondaryText,
                marginLeft: 4,
              }}>
                {rating}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Feedback List */}
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
        {feedbacks.length === 0 ? (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <MessageSquare color={colors.muted} size={64} strokeWidth={1.5} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.primaryText,
              marginTop: 16,
              textAlign: 'center',
            }}>
              No feedback found
            </Text>
            <Text style={{
              fontSize: 14,
              color: colors.secondaryText,
              marginTop: 8,
              textAlign: 'center',
            }}>
              {selectedRating ? `No ${selectedRating}-star feedback available` : 'No feedback has been submitted yet'}
            </Text>
          </View>
        ) : (
          feedbacks.map((feedback, index) => (
            <Animated.View
              key={feedback._id}
              entering={FadeInDown.delay(index * 50)}
              style={{
                backgroundColor: colors.white,
                borderRadius: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                overflow: 'hidden',
              }}
            >
              <Pressable
                onPress={() => openFeedbackModal(feedback)}
                style={{ padding: 20 }}
              >
                {/* Header */}
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
                      {feedback.event.title}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.accent,
                      textTransform: 'uppercase',
                      fontWeight: '500',
                    }}>
                      {feedback.event.category}
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    {renderStarRating(feedback.rating, 16)}
                    <Text style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 4,
                    }}>
                      {getTimeAgo(feedback.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* User Info */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: colors.white,
                    }}>
                      {feedback.user.nickname.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.primaryText,
                    }}>
                      {feedback.user.nickname}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                    }}>
                      {feedback.user.email}
                    </Text>
                  </View>
                </View>

                {/* Comment */}
                <Text style={{
                  fontSize: 14,
                  color: colors.secondaryText,
                  lineHeight: 20,
                  marginBottom: 12,
                }}
                numberOfLines={3}
                >
                  {feedback.comment}
                </Text>

                {/* Event Info */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.cardBorder,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Calendar color={colors.muted} size={12} strokeWidth={1.5} />
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      marginLeft: 4,
                    }}>
                      {formatDate(feedback.event.time)}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MapPin color={colors.muted} size={12} strokeWidth={1.5} />
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      marginLeft: 4,
                    }}>
                      {feedback.event.location}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Users color={colors.muted} size={12} strokeWidth={1.5} />
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      marginLeft: 4,
                    }}>
                      {feedback.event.totalAttendees} attended
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Feedback Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFeedbackModal}
      >
        {selectedFeedback && (
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
                  Feedback Details
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.secondaryText,
                }}>
                  {selectedFeedback.event.title}
                </Text>
              </View>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
              {/* Event Info Card */}
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
                  Event Information
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Calendar color={colors.accent} size={16} strokeWidth={2} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.secondaryText,
                    marginLeft: 8,
                  }}>
                    {formatDate(selectedFeedback.event.time)} at {formatTime(selectedFeedback.event.time)}
                  </Text>
                </View>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <MapPin color={colors.accent} size={16} strokeWidth={2} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.secondaryText,
                    marginLeft: 8,
                  }}>
                    {selectedFeedback.event.location}
                  </Text>
                </View>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Users color={colors.accent} size={16} strokeWidth={2} />
                  <Text style={{
                    fontSize: 14,
                    color: colors.secondaryText,
                    marginLeft: 8,
                  }}>
                    {selectedFeedback.event.totalAttendees} total attendees
                  </Text>
                </View>
                
                {selectedFeedback.event.averageRating && (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <Star color={colors.warning} size={16} strokeWidth={2} />
                    <Text style={{
                      fontSize: 14,
                      color: colors.secondaryText,
                      marginLeft: 8,
                    }}>
                      {selectedFeedback.event.averageRating} average rating
                    </Text>
                  </View>
                )}
              </View>

              {/* User Info Card */}
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
                  Submitted by
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.white,
                    }}>
                      {selectedFeedback.user.nickname.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.primaryText,
                    }}>
                      {selectedFeedback.user.nickname}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: colors.secondaryText,
                    }}>
                      {selectedFeedback.user.email}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 4,
                    }}>
                      Submitted {getTimeAgo(selectedFeedback.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rating Card */}
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
                  Rating
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  {renderStarRating(selectedFeedback.rating, 24)}
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: colors.primaryText,
                    marginLeft: 12,
                  }}>
                    {selectedFeedback.rating}/5
                  </Text>
                </View>
                
                <Text style={{
                  fontSize: 14,
                  color: colors.secondaryText,
                }}>
                  {selectedFeedback.rating === 1 && 'Poor'}
                  {selectedFeedback.rating === 2 && 'Fair'}
                  {selectedFeedback.rating === 3 && 'Good'}
                  {selectedFeedback.rating === 4 && 'Very Good'}
                  {selectedFeedback.rating === 5 && 'Excellent'}
                </Text>
              </View>

              {/* Comment Card */}
              <View style={{
                backgroundColor: colors.white,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.primaryText,
                  marginBottom: 12,
                }}>
                  Comment
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: colors.secondaryText,
                  lineHeight: 22,
                }}>
                  {selectedFeedback.comment}
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default AdminFeedbackDashboard; 