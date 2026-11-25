import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useNotify } from '../../context/NotificationContext';

export default function ForgotPasswordScreen({ navigation }) {
  const { showNotification } = useNotify();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    showNotification('If this email exists (demo), a reset link would be sent.', 'success');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Reset password" subtitle="Enter your email to receive reset instructions (demo)" onBack={() => navigation.goBack()} />
        <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <AppButton title="Send reset link" onPress={onSubmit} loading={loading} />
        <Text style={styles.note}>This is a demo flow. No real email is sent.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl },
  note: { marginTop: spacing.lg, color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
});