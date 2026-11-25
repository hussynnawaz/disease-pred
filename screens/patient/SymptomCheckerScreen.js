import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import ScreenHeader from '../../components/ScreenHeader';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import LoadingBlock from '../../components/LoadingBlock';
import { symptomService } from '../../services/symptomService';
import { diseasePredictionService } from '../../services/diseasePredictionService';
import { useNotify } from '../../context/NotificationContext';
import { Ionicons } from '@expo/vector-icons';

export default function SymptomCheckerScreen({ navigation }) {
  const { showNotification } = useNotify();
  const [query, setQuery] = useState('');
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('Moderate');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await symptomService.getAllSymptoms();
        setAllSymptoms(list || []);
      } catch (e) {
        setAllSymptoms([]);
        showNotification('Cannot load symptoms. Is the backend running? Check API URL.', 'error');
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim().replace(/_/g, ' ');
    if (!q) return allSymptoms.slice(0, 40);
    return allSymptoms.filter((s) => s.toLowerCase().replace(/_/g, ' ').includes(q)).slice(0, 40);
  }, [query, allSymptoms]);

  const toggleSymptom = (s) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const removeSymptom = (s) => setSelected((prev) => prev.filter((x) => x !== s));

  const onSubmit = async () => {
    if (selected.length === 0) {
      showNotification('Please select at least one symptom.', 'error');
      return;
    }
    if (selected.length < 3) {
      showNotification('Please select at least 3 symptoms for more reliable results.', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await diseasePredictionService.predict({ symptoms: selected, duration, severity, notes });
      setResult(res);
    } catch (e) {
      showNotification(e.message || 'Assessment failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Symptom Checker" subtitle="Preliminary AI assessment (via model API)" onBack={() => navigation.goBack()} />

        <Text style={styles.label}>Search symptoms</Text>
        <TextInput
          style={styles.search}
          placeholder="e.g. headache, rash, fever"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
        {allSymptoms.length === 0 && (
          <Text style={{ color: colors.danger, marginBottom: spacing.md, fontSize: 13 }}>
            No symptoms loaded. Ensure the Flask backend is running (python app.py) and API URL matches your device.
          </Text>
        )}

        <View style={styles.chipWrap}>
          {filtered.map((s) => {
            const active = selected.includes(s);
            return (
              <Pressable key={s} onPress={() => toggleSymptom(s)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.replace(/_/g, ' ')}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected.length > 0 && (
          <View style={styles.selectedBox}>
            <Text style={styles.sectionTitle}>Selected symptoms</Text>
            <View style={styles.chipWrap}>
              {selected.map((s) => (
                <Pressable key={s} onPress={() => removeSymptom(s)} style={[styles.chip, styles.chipSelected]}>
                  <Text style={styles.chipTextActive}>{s.replace(/_/g, ' ')}</Text>
                  <Ionicons name="close-circle" size={16} color="#fff" style={{ marginLeft: 4 }} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <AppInput label="Duration (e.g. 2 days)" value={duration} onChangeText={setDuration} placeholder="How long?" />
        <Text style={styles.label}>Severity</Text>
        <View style={styles.severityRow}>
          {['Mild', 'Moderate', 'Severe'].map((lv) => (
            <Pressable key={lv} onPress={() => setSeverity(lv)} style={[styles.sevBtn, severity === lv && styles.sevBtnActive]}>
              <Text style={[styles.sevText, severity === lv && styles.sevTextActive]}>{lv}</Text>
            </Pressable>
          ))}
        </View>
        <AppInput label="Additional notes" value={notes} onChangeText={setNotes} placeholder="Anything else the clinician should know?" multiline />

        {selected.length > 0 && selected.length < 3 && (
          <Text style={{ color: colors.danger, fontSize: 12, marginBottom: spacing.sm }}>
            Select at least {3 - selected.length} more symptom(s) for reliable results (model needs 3+).
          </Text>
        )}
        <AppButton title="Run Assessment" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.sm }} />

        {loading && <LoadingBlock label="Analyzing symptoms..." />}

        {result && !loading && (
          <View style={styles.resultsWrap}>
            {result.inputWarning ? (
              <View style={[styles.disclaimer, { borderLeftColor: colors.danger, backgroundColor: '#FFF0F0' }]}>
                <Text style={[styles.disclaimerTitle, { color: colors.danger }]}>Input quality warning</Text>
                <Text style={[styles.disclaimerText, { color: colors.danger }]}>{result.inputWarning}</Text>
              </View>
            ) : null}
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>Important</Text>
              <Text style={styles.disclaimerText}>{result.disclaimer}</Text>
              <Text style={[styles.disclaimerText, { marginTop: 6 }]}>{result.modelNote}</Text>
            </View>

            <AppCard style={styles.recCard}>
              <Text style={styles.sectionTitle}>AI Explanation (demo)</Text>
              <Text style={styles.bodyText}>Selected symptoms: {result.inputs.symptoms.map((s) => s.replace(/_/g, ' ')).join(', ')}</Text>
              <Text style={styles.bodyText}>Duration: {result.inputs.duration || 'Not provided'}</Text>
              <Text style={styles.bodyText}>Severity: {result.inputs.severity || 'Not provided'}</Text>
              <Text style={[styles.bodyText, { marginTop: 8, fontSize: 12, color: colors.textSecondary }]}>
                Model scores are relative outputs from the trained model. They are not clinically validated diagnostic confidence.
              </Text>
            </AppCard>

            <Text style={styles.resultsHeading}>Possible conditions (preliminary)</Text>
            {result.predictions.map((p, idx) => (
              <AppCard key={idx} style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <Text style={styles.diseaseName}>{String(p.disease).replace(/_/g, ' ')}</Text>
                  <View style={styles.scorePill}>
                    <Text style={styles.scoreText}>{Math.round(p.score * 100)}% score</Text>
                  </View>
                </View>
                <Text style={styles.resultDesc}>{p.description}</Text>
                {p.precautions?.length ? (
                  <View style={styles.precWrap}>
                    <Text style={styles.precLabel}>Precautions (general)</Text>
                    {p.precautions.map((pr) => (
                      <Text key={pr} style={styles.precItem}>• {pr}</Text>
                    ))}
                  </View>
                ) : null}
              </AppCard>
            ))}

            <AppCard style={styles.recCard}>
              <Text style={styles.sectionTitle}>Recommended specialty</Text>
              <Text style={styles.bodyText}>{result.recommendedSpecialty}</Text>
            </AppCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
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
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary, flexDirection: 'row', alignItems: 'center' },
  chipText: { fontSize: 12, color: colors.text },
  chipTextActive: { color: '#fff', fontSize: 12 },
  selectedBox: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  severityRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  sevBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.surface },
  sevBtnActive: { borderColor: colors.primary, backgroundColor: '#EEF5F1' },
  sevText: { color: colors.textSecondary, fontWeight: '600' },
  sevTextActive: { color: colors.primary },
  resultsWrap: { marginTop: spacing.xxl },
  disclaimer: { backgroundColor: '#FFF8E6', borderRadius: radius.md, padding: spacing.lg, borderLeftWidth: 4, borderLeftColor: colors.accent, marginBottom: spacing.lg },
  disclaimerTitle: { fontWeight: '700', color: '#6B5E2E', marginBottom: 4 },
  disclaimerText: { color: '#6B5E2E', fontSize: 12, lineHeight: 18 },
  resultsHeading: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  resultCard: { marginBottom: spacing.md },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  diseaseName: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  scorePill: { backgroundColor: colors.secondary, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 999 },
  scoreText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  resultDesc: { marginTop: spacing.sm, color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  precWrap: { marginTop: spacing.md },
  precLabel: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 4 },
  precItem: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  recCard: { marginTop: spacing.sm },
  bodyText: { color: colors.text, fontSize: 14 },
});