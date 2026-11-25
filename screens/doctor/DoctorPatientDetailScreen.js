import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import ScreenHeader from '../../components/ScreenHeader';

export default function DoctorPatientDetailScreen({ route, navigation }) {
  const { patient } = route.params || {};
  if (!patient) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ padding: spacing.xl }}><Text>Patient not found.</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title={patient.name} subtitle={`${patient.age} yrs · ${patient.gender}`} onBack={() => navigation.goBack()} />
        <AppCard style={styles.card}>
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{patient.phone}</Text>
          <Text style={styles.value}>{patient.email}</Text>
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <Text style={styles.bodyText}>{patient.allergies}</Text>
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Current medications</Text>
          {patient.currentMeds?.length ? patient.currentMeds.map((m) => <Text key={m} style={styles.bodyText}>• {m}</Text>) : <Text style={styles.bodyText}>None listed</Text>}
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Medical history</Text>
          {patient.history?.map((h) => <Text key={h} style={styles.bodyText}>• {h}</Text>)}
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.bodyText}>Previous assessments, uploaded reports, and clinical notes would appear here (demo).</Text>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: 40 },
  card: { marginBottom: spacing.lg },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  value: { fontSize: 14, color: colors.text, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  bodyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});