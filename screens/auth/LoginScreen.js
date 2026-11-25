import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { showNotification } = useNotify();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      showNotification(res.message || 'Login failed.', 'error');
      return;
    }
    showNotification('Welcome back!', 'success');
    // Navigation handled by root navigator based on auth state
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Sign in" subtitle="Access your Health Monitoring dashboard" onBack={() => navigation.goBack()} />
        <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" error={errors.email} />
        <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry error={errors.password} />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
        <AppButton title="Sign In" onPress={onSubmit} loading={loading} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>No account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Create one</Text>
          </Pressable>
        </View>
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo accounts</Text>
          <Text style={styles.demoText}>Patient: patient@demo.com / demo123</Text>
          <Text style={styles.demoText}>Doctor: doctor@demo.com / demo123</Text>
          <Text style={styles.demoText}>Admin: admin@demo.com / demo123</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: spacing.xl, marginTop: -spacing.sm },
  forgotText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textSecondary },
  linkText: { color: colors.primary, fontWeight: '600' },
  demoBox: { marginTop: spacing.xxxl, padding: spacing.lg, backgroundColor: colors.secondary, borderRadius: 12 },
  demoTitle: { fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  demoText: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
});