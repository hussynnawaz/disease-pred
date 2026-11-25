import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { symptomsList } from '../../data/mockData';
import { diseasePredictionService } from '../../services/diseasePredictionService';
import { useNotify } from '../../context/NotificationContext';

export default function DoctorClinicalAssessmentScreen({ navigation }) {
  const { showNotification } = useNotify();
  const [symptomInput, setSymptomInput] = useState('');
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState(null);
  const [decision, setDecision] = useState(null); // 'accepted' | 'rejected'
  const [loading, setLoading] = useState(false);

  const addSymptom = (s) => {
    const val = s.trim().toLowerCase().replace(/ /g, '_');
    if (!val) return;
    if (!selected.includes(val)) setSelected((p) => [...p, val]);
    setSymptomInput('');
  };

  const suggestions = symptomsList.filter((s) => s.includes(symptomInput.toLowerCase().replace(/ /g, '_'))).slice(0, 8);

  const runAssessment = async () => {
    if (selected.length === 0) {
      showNotification('Add at least one symptom.', 'error');
      return;
    }
    setLoading(true);
    setDecision(null);
    try {
      const res = await diseasePredictionService.predict({ symptoms: selected, duration: '', severity: 'Clinical review', notes });
      setResult(res);
    } catch (e) {
      showNotification(e.message || 'Failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveAssessment = () => {
    if (!result) return;
    showNotification(`Assessment saved (demo). Decision: ${decision || 'Not set'}`, 'success');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Clinical Symptom Assessment</Text>
        <Text style={styles.subtitle}>AI suggestions are decision support only — require clinician review.</Text>

        <AppInput label="Add symptom (type and tap suggestion)" value={symptomInput} onChangeText={setSymptomInput} placeholder="e.g. headache" />
        {symptomInput.length > 1 && (
          <View style={styles.suggestWrap}>
            {suggestions.map((s) => (
              <Pressable key={s} style={styles.suggestItem} onPress={() => addSymptom(s)}>
                <Text style={styles.suggestText}>{s.replace(/_/g, ' ')}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.chipRow}>
          {selected.map((s) => (
            <Pressable key={s} style={styles.chip} onPress={() => setSelected((p) => p.filter((x) => x !== s))}>
              <Text style={styles.chipText}>{s.replace(/_/g, ' ')} ×</Text>
            </Pressable>
          ))}
        </View>

        <AppInput label="Clinical notes" value={notes} onChangeText={setNotes} placeholder="Your observations..." multiline />

        <AppButton title="Get AI suggestions (demo)" onPress={runAssessment} loading={loading} />

        {result && (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.sectionTitle}>AI-generated suggestions</Text>
            <Text style={styles.disclaimer}>{result.disclaimer}</Text>
            {result.predictions.map((p, i) => (
              <AppCard key={i} style={styles.card}>
                <Text style={styles.disease}>{String(p.disease).replace(/_/g, ' ')}</Text>
                <Text style={styles.score}>Model score: {Math.round(p.score * 100)}% (not clinical confidence)</Text>
                <Text style={styles.desc}>{p.description}</Text>
              </AppCard>
            ))}
            <Text style={styles.sectionTitle}>Your decision</Text>
            <View style={styles.decisionRow}>
              <Pressable style={[styles.decisionBtn, decision === 'accepted' && styles.decisionAccept]} onPress={() => setDecision('accepted')}>
                <Text style={[styles.decisionText, decision === 'accepted' && styles.decisionTextActive]}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.decisionBtn, decision === 'rejected' && styles.decisionReject]} onPress={() => setDecision('rejected')}>
                <Text style={[styles.decisionText, decision === 'rejected' && styles.decisionTextActive]}>Reject</Text>
              </Pressable>
            </View>
            <AppButton title="Save Assessment" onPress={saveAssessment} style={{ marginTop: spacing.lg }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  suggestWrap: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  suggestItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  suggestText: { color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999 },
  chipText: { color: '#fff', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  disclaimer: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  disease: { fontSize: 15, fontWeight: '700', color: colors.text },
  score: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  desc: { fontSize: 14, color: colors.text, marginTop: spacing.sm },
  decisionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  decisionBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  decisionAccept: { borderColor: colors.success, backgroundColor: '#EEF7F1' },
  decisionReject: { borderColor: colors.danger, backgroundColor: '#FFF0F0' },
  decisionText: { fontWeight: '600', color: colors.textSecondary },
  decisionTextActive: { color: colors.text },
});