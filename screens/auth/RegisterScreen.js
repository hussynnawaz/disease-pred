import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';
import { ROLES } from '../../data/mockData';

const roleOptions = [
  { value: ROLES.PATIENT, label: 'Patient', desc: 'Track symptoms, meds, and records' },
  { value: ROLES.DOCTOR, label: 'Doctor', desc: 'Review patients and assessments' },
  { value: ROLES.ADMIN, label: 'Administrator', desc: 'Manage users and system overview' },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { showNotification } = useNotify();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.PATIENT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!phone.trim()) e.phone = 'Phone number is required.';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await register({ name, email, phone, password, role });
    setLoading(false);
    if (!res.ok) {
      showNotification(res.message || 'Registration failed.', 'error');
      return;
    }
    showNotification('Account created (demo).', 'success');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Create account" subtitle="Join the Health Monitoring System (demo)" onBack={() => navigation.goBack()} />
        <AppInput label="Full name" value={name} onChangeText={setName} placeholder="Your full name" error={errors.name} />
        <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" error={errors.email} />
        <AppInput label="Phone number" value={phone} onChangeText={setPhone} placeholder="+92 ..." keyboardType="phone-pad" error={errors.phone} />
        <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Min 6 characters" secureTextEntry error={errors.password} />

        <Text style={styles.sectionLabel}>Select role</Text>
        {roleOptions.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.roleCard, role === opt.value && styles.roleCardActive]}
            onPress={() => setRole(opt.value)}
          >
            <Text style={[styles.roleTitle, role === opt.value && styles.roleTitleActive]}>{opt.label}</Text>
            <Text style={styles.roleDesc}>{opt.desc}</Text>
          </Pressable>
        ))}

        <AppButton title="Create Account" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  roleCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: '#EEF5F1' },
  roleTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  roleTitleActive: { color: colors.primary },
  roleDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textSecondary },
  linkText: { color: colors.primary, fontWeight: '600' },
});