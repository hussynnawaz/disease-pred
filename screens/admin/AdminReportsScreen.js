import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppCard from '../../components/AppCard';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 40;

export default function AdminReportsScreen() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ data: [3, 5, 2, 6, 4] }],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Weekly assessments (demo)</Text>
          <BarChart
            data={data}
            width={screenWidth - 32}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(27, 75, 58, ${opacity})`,
              labelColor: () => colors.textSecondary,
            }}
            style={{ borderRadius: 12, marginTop: 8 }}
            fromZero
          />
        </AppCard>
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.text}>• Total assessments this week: 20 (demo)</Text>
          <Text style={styles.text}>• Most active day: Thursday</Text>
          <Text style={styles.text}>• System uptime: 99.9% (demo)</Text>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  text: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});