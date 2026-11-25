import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing, shadow } from '../constants/theme';
import AppButton from './AppButton';

export default function ConfirmDialog({ visible, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, danger }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.msg}>{message}</Text> : null}
          <View style={styles.row}>
            <AppButton title={cancelText} variant="outline" onPress={onCancel} style={styles.btn} />
            <AppButton
              title={confirmText}
              onPress={onConfirm}
              style={[styles.btn, danger && { backgroundColor: colors.danger }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.card,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  msg: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  btn: { flex: 1 },
});