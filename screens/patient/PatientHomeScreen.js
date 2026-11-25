import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { demoAssessments, demoHealthRecords, demoMedications } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function PatientHomeScreen({ navigation }) {
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const latestAssessment = demoAssessments[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={18} color="#8A5A00" />
            <Text style={styles.offlineText}>Offline mode — some cloud features unavailable. Local tools still work (demo).</Text>
          </View>
        )}

        <Text style={styles.greet}>{greeting},</Text>
        <Text style={styles.name}>{user?.name || 'Patient'}</Text>
        <Text style={styles.tagline}>Here is your health overview for today.</Text>

        <View style={styles.quickRow}>
          <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('SymptomChecker')}>
            <Ionicons name="fitness-outline" size={22} color={colors.primary} />
            <Text style={styles.quickText}>Symptom Check</Text>
          </Pressable>
          <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('AI Assistant')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.primary} />
            <Text style={styles.quickText}>AI Assistant</Text>
          </Pressable>
          <Pressable style={styles.quickBtn} onPress={() => navigation.navigate('Medications')}>
            <Ionicons name="medkit-outline" size={22} color={colors.primary} />
            <Text style={styles.quickText}>Medications</Text>
          </Pressable>
        </View>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Latest health assessment (demo)</Text>
          {latestAssessment ? (
            <>
              <Text style={styles.meta}>{latestAssessment.date}</Text>
              <Text style={styles.bodyText}>Symptoms: {latestAssessment.symptoms.join(', ')}</Text>
              <Text style={styles.bodyText}>Top result: {latestAssessment.results[0]?.disease} ({Math.round((latestAssessment.results[0]?.score || 0) * 100)}% score)</Text>
            </>
          ) : (
            <Text style={styles.bodyText}>No assessments yet.</Text>
          )}
          <Pressable onPress={() => navigation.navigate('SymptomChecker')} style={styles.linkRow}>
            <Text style={styles.linkText}>Run a new assessment</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent medical reports</Text>
          {demoHealthRecords.slice(0, 2).map((r) => (
            <View key={r.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>{r.title}</Text>
              <Text style={styles.itemMeta}>{r.date} · {r.category}</Text>
            </View>
          ))}
          <Pressable onPress={() => navigation.navigate('Health Records')} style={styles.linkRow}>
            <Text style={styles.linkText}>View all records</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Medication reminders (demo)</Text>
          {demoMedications.slice(0, 2).map((m) => (
            <View key={m.id} style={styles.listItem}>
              <Text style={styles.itemTitle}>{m.name}</Text>
              <Text style={styles.itemMeta}>{m.schedule.label} at {m.schedule.time}</Text>
            </View>
          ))}
          <Pressable onPress={() => navigation.navigate('Medications')} style={styles.linkRow}>
            <Text style={styles.linkText}>Open medications</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Upcoming appointments (demo)</Text>
          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>Dr. Hamza Ali</Text>
            <Text style={styles.itemMeta}>2026-11-26 · 10:30 AM · Follow-up</Text>
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF4D6',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  offlineText: { flex: 1, color: '#8A5A00', fontSize: 12, lineHeight: 18 },
  greet: { fontSize: 15, color: colors.textSecondary },
  name: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 2 },
  tagline: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.xl },
  quickRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  quickBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickText: { marginTop: spacing.sm, fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  sectionCard: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  meta: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.xs },
  bodyText: { fontSize: 14, color: colors.text, lineHeight: 20, marginTop: 4 },
  listItem: { paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.md },
  linkText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
});