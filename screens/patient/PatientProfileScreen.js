import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useNotify } from '../../context/NotificationContext';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function PatientProfileScreen() {
  const { user, logout } = useAuth();
  const { isOnline, toggleNetwork } = useNetwork();
  const { showNotification } = useNotify();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const onLogout = async () => {
    setLogoutVisible(false);
    await logout();
    showNotification('Signed out.', 'info');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <AppCard style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || '—'}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '—'}</Text>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user?.phone || '—'}</Text>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role || '—'}</Text>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Connectivity (Demo)</Text>
          <Text style={styles.bodyText}>Status: {isOnline ? 'Online' : 'Offline'}</Text>
          <Text style={styles.hint}>Toggle to simulate offline mode for UI testing.</Text>
          <AppButton title={isOnline ? 'Simulate Offline' : 'Simulate Online'} variant="outline" onPress={toggleNetwork} style={{ marginTop: spacing.md }} />
        </AppCard>

        <AppButton title="Sign Out" variant="outline" onPress={() => setLogoutVisible(true)} style={{ marginTop: spacing.lg }} />

        <ConfirmDialog
          visible={logoutVisible}
          title="Sign out?"
          message="You will need to sign in again."
          confirmText="Sign Out"
          danger
          onCancel={() => setLogoutVisible(false)}
          onConfirm={onLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  label: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm },
  value: { fontSize: 15, color: colors.text, fontWeight: '600', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  bodyText: { fontSize: 14, color: colors.text, marginTop: spacing.sm },
  hint: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});