import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { demoPatients, demoAssessments } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System overview (demo)</Text>

        <View style={styles.statsRow}>
          <AppCard style={styles.statCard}><Text style={styles.statNum}>3</Text><Text style={styles.statLabel}>Total users</Text></AppCard>
          <AppCard style={styles.statCard}><Text style={styles.statNum}>1</Text><Text style={styles.statLabel}>Doctors</Text></AppCard>
        </View>
        <View style={styles.statsRow}>
          <AppCard style={styles.statCard}><Text style={styles.statNum}>{demoPatients.length}</Text><Text style={styles.statLabel}>Patients</Text></AppCard>
          <AppCard style={styles.statCard}><Text style={styles.statNum}>{demoAssessments.length}</Text><Text style={styles.statLabel}>Assessments</Text></AppCard>
        </View>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Management</Text>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('AdminUsers')}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>User management</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('AdminReports')}>
            <Ionicons name="bar-chart-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Reports & analytics</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.actionRow} onPress={() => navigation.navigate('AdminSettings')}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>System configuration</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>System activity (demo)</Text>
          <Text style={styles.activityText}>• New assessment submitted (2h ago)</Text>
          <Text style={styles.activityText}>• Record uploaded (5h ago)</Text>
          <Text style={styles.activityText}>• New patient registered (yesterday)</Text>
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
  activityText: { fontSize: 14, color: colors.textSecondary, paddingVertical: 4 },
});