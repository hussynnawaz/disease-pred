import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null); // { type: 'success'|'error'|'info', message }
  const opacity = useMemo(() => new Animated.Value(0), []);

  const showNotification = useCallback((message, type = 'info') => {
    setNotif({ message, type });
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setNotif(null));
    }, 2600);
  }, [opacity]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notif && (
        <Animated.View
          style={[
            styles.toast,
            notif.type === 'success' && styles.success,
            notif.type === 'error' && styles.error,
            notif.type === 'info' && styles.info,
            { opacity },
          ]}
        >
          <Text style={styles.text}>{notif.message}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 90,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    zIndex: 9999,
  },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.danger },
  info: { backgroundColor: colors.primary },
  text: { color: '#fff', fontWeight: '600', fontSize: 14 },
});