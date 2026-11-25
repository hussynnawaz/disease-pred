import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { demoPatients, demoUsers } from '../../data/mockData';

export default function AdminUsersScreen() {
  const [tab, setTab] = useState('patients');
  const doctors = demoUsers.filter((u) => u.role === 'doctor');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>User Management</Text>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, tab === 'patients' && styles.tabActive]} onPress={() => setTab('patients')}>
            <Text style={[styles.tabText, tab === 'patients' && styles.tabTextActive]}>Patients</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'doctors' && styles.tabActive]} onPress={() => setTab('doctors')}>
            <Text style={[styles.tabText, tab === 'doctors' && styles.tabTextActive]}>Doctors</Text>
          </Pressable>
        </View>

        {tab === 'patients' && demoPatients.map((p) => (
          <AppCard key={p.id} style={styles.card}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.meta}>{p.email}</Text>
            <Text style={styles.status}>Status: Active (demo)</Text>
          </AppCard>
        ))}
        {tab === 'doctors' && doctors.map((d) => (
          <AppCard key={d.id} style={styles.card}>
            <Text style={styles.name}>{d.name}</Text>
            <Text style={styles.meta}>{d.email} · {d.specialization || 'General'}</Text>
            <Text style={styles.status}>Status: Active (demo)</Text>
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
  tabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.secondary, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontWeight: '600', color: colors.text },
  tabTextActive: { color: '#fff' },
  card: { marginBottom: spacing.md },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  status: { fontSize: 12, color: colors.success, marginTop: 8, fontWeight: '600' },
});