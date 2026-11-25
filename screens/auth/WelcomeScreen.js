import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppButton from '../../components/AppButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI-Powered Care Support</Text>
        </View>
        <Text style={styles.title}>Health Monitoring{'\n'}System</Text>
        <Text style={styles.subtitle}>
          Preliminary symptom insights, medication guidance support, and organized health records — designed for patients, clinicians, and rural care teams.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What you can do</Text>
          {['Symptom assessment (preliminary AI info)', 'Medication tracking & reference info', 'Secure record organization (demo)', 'Role-based dashboards'].map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.dot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Important: This app provides preliminary, AI-generated information for support only. It is not a confirmed diagnosis or prescription. Always consult a qualified clinician.
          </Text>
        </View>

        <AppButton title="Get Started" onPress={() => navigation.navigate('Login')} />
        <AppButton
          title="Create an account"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.demoHint}>Demo logins: patient@demo.com / doctor@demo.com / admin@demo.com (password: demo123)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.lg,
  },
  badgeText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  title: { fontSize: 34, fontWeight: '800', color: colors.text, lineHeight: 40 },
  subtitle: { marginTop: spacing.lg, fontSize: 15, color: colors.textSecondary, lineHeight: 23 },
  card: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 7, marginRight: spacing.sm },
  bulletText: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20 },
  notice: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: '#FFF8E6',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  noticeText: { color: '#6B5E2E', fontSize: 12, lineHeight: 18 },
  demoHint: { marginTop: spacing.xl, textAlign: 'center', color: colors.textSecondary, fontSize: 12 },
});