import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState({ icon = 'folder-open-outline', title, message }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={48} color={colors.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  title: { fontSize: 17, fontWeight: '600', color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
  msg: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
});