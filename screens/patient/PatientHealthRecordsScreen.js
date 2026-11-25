import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import LoadingBlock from '../../components/LoadingBlock';
import EmptyState from '../../components/EmptyState';
import { medicalRecordService } from '../../services/medicalRecordService';
import { Ionicons } from '@expo/vector-icons';
import { useNotify } from '../../context/NotificationContext';
import AppButton from '../../components/AppButton';

const categories = ['All', 'Laboratory Reports', 'Prescriptions', 'Doctor Notes', 'Diagnosis History', 'Other'];

export default function PatientHealthRecordsScreen() {
  const { showNotification } = useNotify();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [summaryLoading, setSummaryLoading] = useState(null);
  const [summary, setSummary] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await medicalRecordService.getRecords();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = records.filter((r) => {
    const matchCat = cat === 'All' || r.category === cat;
    const matchSearch =
      !search.trim() ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.summary || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const onUploadDemo = async () => {
    await medicalRecordService.addRecordMeta({ title: 'Uploaded Document (Demo)', category: 'Other', type: 'PDF' });
    showNotification('Demo document added to records.', 'success');
    load();
  };

  const viewSummary = async (id) => {
    setSummaryLoading(id);
    setSummary(null);
    const res = await medicalRecordService.getAISummary(id);
    setSummary({ id, ...res });
    setSummaryLoading(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Health Records</Text>
        <Text style={styles.subtitle}>Demo records stored locally. Upload simulates adding metadata.</Text>

        <AppButton title="Upload Document (Demo)" variant="outline" onPress={onUploadDemo} style={{ marginBottom: spacing.lg }} />

        <TextInput
          style={styles.search}
          placeholder="Search records..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }}>
          <View style={styles.catRow}>
            {categories.map((c) => (
              <Pressable key={c} onPress={() => setCat(c)} style={[styles.catChip, cat === c && styles.catChipActive]}>
                <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {loading ? (
          <LoadingBlock label="Loading records..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="document-text-outline" title="No records found" message="Try adjusting search or filters, or upload a demo document." />
        ) : (
          filtered.map((r) => (
            <AppCard key={r.id} style={styles.recordCard}>
              <View style={styles.recordTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recordTitle}>{r.title}</Text>
                  <Text style={styles.recordMeta}>{r.date} · {r.category} · {r.type}</Text>
                </View>
                <Ionicons name="document-outline" size={22} color={colors.primary} />
              </View>
              <Text style={styles.recordSummary}>{r.summary}</Text>
              {r.doctorNote ? <Text style={styles.doctorNote}>Doctor note: {r.doctorNote}</Text> : null}
              <Pressable style={styles.summaryBtn} onPress={() => viewSummary(r.id)}>
                <Text style={styles.summaryBtnText}>{summaryLoading === r.id ? 'Generating...' : 'View AI summary (demo)'}</Text>
              </Pressable>
            </AppCard>
          ))
        )}

        {summary && (
          <AppCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>AI Summary (Demo)</Text>
            <Text style={styles.disclaimerSmall}>{summary.disclaimer}</Text>
            <Text style={styles.sumLabel}>Important information</Text>
            {summary.importantInfo.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
            <Text style={styles.sumLabel}>Previous diagnoses</Text>
            {summary.previousDiagnoses.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
            <Text style={styles.sumLabel}>Current medications</Text>
            {summary.currentMedications.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
            <Text style={styles.sumLabel}>Allergies</Text>
            {summary.allergies.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
            <Text style={styles.sumLabel}>Lab highlights</Text>
            {summary.labsHighlights.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
            <Text style={styles.sumLabel}>Missing information</Text>
            {summary.missingInfo.map((t, i) => (
              <Text key={i} style={styles.sumItem}>• {t}</Text>
            ))}
          </AppCard>
        )}
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
    marginBottom: spacing.md,
  },
  catRow: { flexDirection: 'row', gap: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { fontSize: 12, color: colors.text },
  catTextActive: { color: '#fff', fontWeight: '600' },
  recordCard: { marginBottom: spacing.md },
  recordTop: { flexDirection: 'row', alignItems: 'flex-start' },
  recordTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  recordMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  recordSummary: { fontSize: 14, color: colors.text, marginTop: spacing.md, lineHeight: 20 },
  doctorNote: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm, fontStyle: 'italic' },
  summaryBtn: { marginTop: spacing.md, alignSelf: 'flex-start' },
  summaryBtnText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  summaryCard: { marginTop: spacing.lg, backgroundColor: '#F0F7F3' },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  disclaimerSmall: { fontSize: 11, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 16 },
  sumLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: spacing.md, marginBottom: 4 },
  sumItem: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});