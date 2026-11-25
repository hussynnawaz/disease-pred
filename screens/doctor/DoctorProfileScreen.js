import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';

export default function DoctorProfileScreen() {
  const { user, logout } = useAuth();
  const { showNotification } = useNotify();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Doctor Profile</Text>
        <AppCard style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || 'Dr. Hamza Ali'}</Text>
          <Text style={styles.label}>Specialization</Text>
          <Text style={styles.value}>{user?.specialization || 'General Medicine'}</Text>
          <Text style={styles.label}>Qualifications</Text>
          <Text style={styles.value}>{user?.qualifications || 'MBBS, FCPS'}</Text>
          <Text style={styles.label}>Availability</Text>
          <Text style={styles.value}>{user?.availability || 'Mon-Fri, 9:00 AM - 2:00 PM'}</Text>
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
  label: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm },
  value: { fontSize: 15, color: colors.text, fontWeight: '600', marginTop: 2 },
});