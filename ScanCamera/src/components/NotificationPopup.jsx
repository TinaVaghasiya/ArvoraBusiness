import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const NotificationPopup = ({ visible, notification, onPress, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const panAnim = useRef(new Animated.ValueXY()).current;
  const dismissTimerRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderGrant: () => {
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }
      },
      onPanResponderMove: (_, gestureState) => {
        panAnim.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          const direction = gestureState.dx > 0 ? width : -width;
          Animated.parallel([
            Animated.timing(panAnim.x, {
              toValue: direction,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            panAnim.setValue({ x: 0, y: 0 });
            if (onDismiss) onDismiss();
          });
        } else {
          Animated.spring(panAnim, {
            toValue: { x: 0, y: 0 },
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }).start();
          
          dismissTimerRef.current = setTimeout(() => {
            dismissPopup();
          }, 5000);
        }
      },
    })
  ).current;

  useEffect(() => {
    // console.log('🎨 NotificationPopup - visible:', visible);
    // console.log('🎨 NotificationPopup - notification:', notification);
    
    if (visible && notification) {
      console.log('Showing popup animation');
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 5 seconds
      dismissTimerRef.current = setTimeout(() => {
        dismissPopup();
      }, 5000);

      return () => {
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
        }
      };
    } else {
      dismissPopup();
    }
  }, [visible]);

  const dismissPopup = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      panAnim.setValue({ x: 0, y: 0 });
      if (onDismiss) onDismiss();
    });
  };

  if (!notification) return null;

  const getIconAndColor = (type) => {
    switch (type) {
      case 'card_scanned':
        return { icon: 'scan', color: '#10B981', bgColor: '#D1FAE5' };
      case 'profile_update':
        return { icon: 'person', color: '#3B82F6', bgColor: '#DBEAFE' };
      case 'success':
        return { icon: 'checkmark-circle', color: '#10B981', bgColor: '#D1FAE5' };
      case 'warning':
        return { icon: 'warning', color: '#F59E0B', bgColor: '#FEF3C7' };
      case 'system':
      default:
        return { icon: 'notifications', color: '#6366F1', bgColor: '#E0E7FF' };
    }
  };

  const { icon, color, bgColor } = getIconAndColor(notification.type);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { translateX: panAnim.x },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          dismissPopup();
          if (onPress) onPress();
        }}
        style={styles.touchable}
      >
        <BlurView intensity={95} tint="light" style={styles.blurContainer}>
          <View style={styles.appNameHeader}>
            <Text style={styles.appName}>ArvoraScanner</Text>
          </View>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {notification.title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 999,
  },
  touchable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appNameHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  appName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});

export default NotificationPopup;
