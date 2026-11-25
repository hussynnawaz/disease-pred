import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../constants/theme';
import { chatbotService } from '../../services/chatbotService';
import { Ionicons } from '@expo/vector-icons';
import ConfirmDialog from '../../components/ConfirmDialog';

const suggestions = [
  'I have a headache and nausea',
  'What should I know about fever?',
  'Tell me about medication safety',
];

export default function PatientAIAssistantScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 'm0',
      role: 'assistant',
      text: 'Hello! I am a health guidance assistant (server-backed). I can offer general guidance and help you navigate the app. I cannot diagnose conditions or prescribe medicines. How can I help today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const scrollRef = useRef(null);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content) return;
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    try {
      const reply = await chatbotService.sendMessage(content);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: 'assistant',
          text: 'Could not reach the server. Make sure the backend is running and API URL is correct.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm0',
        role: 'assistant',
        text: 'Chat cleared. How can I help you today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setClearVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSub}>Guidance from server • not a real clinician</Text>
          </View>
          <Pressable onPress={() => setClearVisible(true)} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.chatBody} onContentSizeChange={() => scrollRef.current?.scrollToEnd()}>
          <Pressable style={styles.shortcut} onPress={() => navigation.navigate('SymptomChecker')}>
            <Ionicons name="fitness-outline" size={18} color={colors.primary} />
            <Text style={styles.shortcutText}>Go to Symptom Checker</Text>
          </Pressable>

          {messages.map((m) => (
            <View key={m.id} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={[styles.bubbleText, m.role === 'user' && styles.userBubbleText]}>{m.text}</Text>
              <Text style={[styles.timeText, m.role === 'user' && styles.userTimeText]}>{m.time}</Text>
            </View>
          ))}
          {typing && (
            <View style={[styles.bubble, styles.assistantBubble]}>
              <Text style={styles.bubbleText}>Typing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.suggestionsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            {suggestions.map((s) => (
              <Pressable key={s} style={styles.suggestionChip} onPress={() => send(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={() => send()}>
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={clearVisible}
        title="Clear chat?"
        message="This will remove the current conversation from view (demo)."
        confirmText="Clear"
        danger
        onCancel={() => setClearVisible(false)}
        onConfirm={clearChat}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  clearBtn: { padding: spacing.sm },
  chatBody: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  shortcutText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  bubble: { maxWidth: '85%', padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  bubbleText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  timeText: { fontSize: 10, color: colors.textSecondary, marginTop: 6 },
  userTimeText: { color: 'rgba(255,255,255,0.8)' },
  suggestionsWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  suggestionText: { fontSize: 12, color: colors.text },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});