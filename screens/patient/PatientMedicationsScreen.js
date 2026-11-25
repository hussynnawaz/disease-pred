import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import LoadingBlock from '../../components/LoadingBlock';
import { medicationService } from '../../services/medicationService';
import { useNotify } from '../../context/NotificationContext';

export default function PatientMedicationsScreen() {
  const { showNotification } = useNotify();
  const [meds, setMeds] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const [m, l] = await Promise.all([medicationService.getMedications(), medicationService.getMedicationLogs()]);
    setMeds(m);
    setLogs(l);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = meds.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const logStatus = async (medId, status) => {
    await medicationService.logMedication({ medicationId: medId, status });
    showNotification(`Marked as ${status} (demo).`, 'success');
    load();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Medications</Text>
        <Text style={styles.subtitle}>Reference info + reminders (demo). Not a prescription.</Text>

        <TextInput
          style={styles.search}
          placeholder="Search medication..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <LoadingBlock label="Loading medications..." />
        ) : (
          filtered.map((m) => (
            <AppCard key={m.id} style={styles.card}>
              <Pressable onPress={() => setSelected(selected?.id === m.id ? null : m)}>
                <Text style={styles.medName}>{m.name}</Text>
                <Text style={styles.medMeta}>Reminder: {m.schedule.label} at {m.schedule.time}</Text>
              </Pressable>
              {selected?.id === m.id && (
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Intended usage</Text>
                  <Text style={styles.detailText}>{m.usage}</Text>
                  <Text style={styles.detailLabel}>Common side effects</Text>
                  <Text style={styles.detailText}>{m.sideEffects}</Text>
                  <Text style={styles.detailLabel}>Precautions</Text>
                  <Text style={styles.detailText}>{m.precautions}</Text>
                  <Text style={styles.detailLabel}>Dosage note (sample only)</Text>
                  <Text style={styles.detailText}>{m.dosageNote}</Text>
                  <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={() => logStatus(m.id, 'taken')}>
                      <Text style={styles.actionBtnText}>Taken</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, { backgroundColor: colors.danger }]} onPress={() => logStatus(m.id, 'skipped')}>
                      <Text style={styles.actionBtnText}>Skipped</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </AppCard>
          ))
        )}

        <Text style={styles.sectionTitle}>Recent log (demo)</Text>
        {logs.length === 0 ? (
          <Text style={styles.emptyLog}>No medication logs yet.</Text>
        ) : (
          logs.slice(0, 5).map((l) => {
            const med = meds.find((m) => m.id === l.medicationId);
            return (
              <View key={l.id} style={styles.logRow}>
                <Text style={styles.logText}>{med?.name || 'Medication'} — {l.status}</Text>
                <Text style={styles.logTime}>{new Date(l.at).toLocaleString()}</Text>
              </View>
            );
          })
        )}

        <View style={styles.warnBox}>
          <Text style={styles.warnText}>
            Do not generate independent treatment prescriptions. Dosage above is sample text only. Never take medication decisions without a qualified clinician/pharmacist.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.md },
  medName: { fontSize: 16, fontWeight: '700', color: colors.text },
  medMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  detailBox: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  detailLabel: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  detailText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  actionBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  emptyLog: { color: colors.textSecondary, fontSize: 14 },
  logRow: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  logText: { fontSize: 14, color: colors.text },
  logTime: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  warnBox: { marginTop: spacing.xxl, backgroundColor: '#FFF8E6', padding: spacing.lg, borderRadius: radius.md },
  warnText: { fontSize: 12, color: '#6B5E2E', lineHeight: 18 },
});