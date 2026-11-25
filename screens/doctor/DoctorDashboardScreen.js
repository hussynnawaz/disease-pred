import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { demoPatients, demoAppointments, demoAssessments } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorDashboardScreen({ navigation }) {
  const todayAppts = demoAppointments.filter((a) => a.date === '2026-11-26');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>Overview (demo data)</Text>

        <View style={styles.statsRow}>
          <AppCard style={styles.statCard}>
            <Text style={styles.statNum}>{demoPatients.length}</Text>
            <Text style={styles.statLabel}>Total patients</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Text style={styles.statNum}>{todayAppts.length}</Text>
            <Text style={styles.statLabel}>Today's appts</Text>
          </AppCard>
        </View>
        <View style={styles.statsRow}>
          <AppCard style={styles.statCard}>
            <Text style={styles.statNum}>{demoAssessments.length}</Text>
            <Text style={styles.statLabel}>Recent assessments</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Pending reviews</Text>
          </AppCard>
        </View>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('DoctorPatients')}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Patient directory</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('DoctorAppointments')}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Appointments</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('ClinicalAssessment')}>
            <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Clinical symptom assessment</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent patient activity (demo)</Text>
          {demoPatients.slice(0, 3).map((p) => (
            <View key={p.id} style={styles.activityRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{p.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityName}>{p.name}</Text>
                <Text style={styles.activityMeta}>Last update: demo record activity</Text>
              </View>
            </View>
          ))}
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xl },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1 },
  statNum: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  sectionCard: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.md },
  actionText: { flex: 1, fontSize: 14, color: colors.text },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primary, fontWeight: '700' },
  activityName: { fontSize: 14, fontWeight: '600', color: colors.text },
  activityMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});