import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';

export default function AdminSettingsScreen() {
  const { logout } = useAuth();
  const { showNotification } = useNotify();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>System Configuration</Text>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>General</Text>
          <Text style={styles.text}>Environment: Demo / Local</Text>
          <Text style={styles.text}>AI backend: Not connected (mock services)</Text>
          <Text style={styles.text}>Offline sync: Demo queue enabled</Text>
        </AppCard>
        <AppButton title="Sign Out" variant="outline" onPress={async () => { await logout(); showNotification('Signed out.', 'info'); }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  text: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});