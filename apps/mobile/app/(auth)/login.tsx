import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../lib/constants';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length < 4) return;
    setLoading(true);
    await login(phone, otp);
    setLoading(false);
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (step === 2) setStep(1);
            else router.back();
          }}>
            <Ionicons name="arrow-back" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {step === 1 ? 'Enter your phone number' : 'Verify your number'}
          </Text>
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.subtitle}>
              We will send a confirmation code to your phone.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
            <TouchableOpacity 
              style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={phone.length < 10 || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <Text style={styles.buttonText}>Next</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color={COLORS.text} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to +91 {phone}
            </Text>
            <TextInput
              style={styles.otpInput}
              placeholder="0000"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
              textAlign="center"
            />
            <TouchableOpacity 
              style={[styles.button, otp.length < 4 && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={otp.length < 4 || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resendBtn}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 32,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    color: COLORS.text,
  },
  otpInput: {
    fontSize: 32,
    letterSpacing: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    marginBottom: 32,
    paddingVertical: 12,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textLight,
    paddingHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  }
});
