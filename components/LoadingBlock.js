import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function LoadingBlock({ label = 'Loading...' }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing.xxxl, alignItems: 'center' },
  text: { marginTop: spacing.md, color: colors.textSecondary, fontSize: 14 },
});