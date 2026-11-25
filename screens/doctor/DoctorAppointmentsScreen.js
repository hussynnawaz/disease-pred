import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { demoAppointments } from '../../data/mockData';

export default function DoctorAppointmentsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Appointments</Text>
        {demoAppointments.map((a) => (
          <AppCard key={a.id} style={styles.card}>
            <Text style={styles.patientName}>{a.patientName}</Text>
            <Text style={styles.meta}>{a.date} · {a.time}</Text>
            <Text style={styles.reason}>Reason: {a.reason}</Text>
            <View style={[styles.statusPill, a.status === 'Completed' ? styles.statusDone : styles.statusUpcoming]}>
              <Text style={styles.statusText}>{a.status}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  patientName: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  reason: { fontSize: 14, color: colors.text, marginTop: spacing.sm },
  statusPill: { alignSelf: 'flex-start', marginTop: spacing.md, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 999 },
  statusUpcoming: { backgroundColor: '#EEF5F1' },
  statusDone: { backgroundColor: '#E8F0EA' },
  statusText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});