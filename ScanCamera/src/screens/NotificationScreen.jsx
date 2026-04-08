import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { BASE_API } from '../utils/api';
import { notificationEmitter } from '../utils/notificationEvents';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `${BASE_API}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        await axios.put(
          `${BASE_API}/api/notifications/read-all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        notificationEmitter.emit('newNotification');
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      if (multiSelectMode) {
        cancelMultiSelect();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [multiSelectMode]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put(
        `${BASE_API}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLongPress = (notificationId) => {
    setMultiSelectMode(true);
    setSelectedNotifications([notificationId]);
  };

  const handlePress = (notification) => {
    if (multiSelectMode) {
      toggleSelection(notification._id);
    } else if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  const toggleSelection = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    const allIds = notifications.map((notif) => notif._id);
    setSelectedNotifications(allIds);
  };

  const cancelMultiSelect = () => {
    setMultiSelectMode(false);
    setSelectedNotifications([]);
  };

  const deleteSelectedNotifications = () => {
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(
        `${BASE_API}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { notificationIds: selectedNotifications },
        }
      );
      setNotifications((prev) =>
        prev.filter((notif) => !selectedNotifications.includes(notif._id))
      );
      setDeleteConfirmVisible(false);
      cancelMultiSelect();
    } catch (error) {
      console.error('Error deleting notifications:', error);
      setDeleteConfirmVisible(false);
    }
  };

  const renderNotification = ({ item }) => {
    const isSelected = selectedNotifications.includes(item._id);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item._id)}
        activeOpacity={0.7}
      >
        {multiSelectMode && (
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
              {isSelected && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
          </View>
        )}
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => {
            if (multiSelectMode) {
              cancelMultiSelect();
            } else {
              navigation.goBack();
            }
          }} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerRight}>
            {multiSelectMode ? (
              <>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={deleteSelectedNotifications}
                  disabled={selectedNotifications.length === 0}
                >
                  <Ionicons name="trash" size={22} color={selectedNotifications.length > 0 ? "#fff" : "#888"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelMultiSelect}
                >
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </View>
      {multiSelectMode && (
        <View style={styles.selectionBanner}>
          <Text style={styles.selectionText}>
            {selectedNotifications.length} selected
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (selectedNotifications.length === notifications.length) {
                setSelectedNotifications([]);
              } else {
                selectAll();
              }
            }}
            style={styles.selectAllButton}
          >
            <View style={[styles.checkbox, selectedNotifications.length === notifications.length && styles.checkboxActive]}>
              {selectedNotifications.length === notifications.length && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.selectAllTextLabel}>Select All</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
      )}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="trash-outline" size={34} color="#EF4444" />
            </View>
            <Text style={styles.alertTitle}>Delete Notifications</Text>
            <Text style={styles.alertMessage}>
              Are you sure you want to delete {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''}?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteConfirmVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButtonStyle}
                activeOpacity={0.8}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
    paddingTop: 50,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    minHeight: 80,
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  selectedCard: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    fontWeight: '500',
  },
  multiSelectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cancelText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  selectAllText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  selectionBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F4F6FA',
  },
  selectionText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e7ff',
    marginTop: 8,
  },
  selectAllButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectAllTextLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#E8E9EB',
    borderRadius: 28,
    padding: 28,
    width: '88%',
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  alertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonStyle: {
    flex: 1,
    height: 45,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default NotificationScreen;
