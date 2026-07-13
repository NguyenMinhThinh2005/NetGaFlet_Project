import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import Theme from '../constants/Theme';
import ChatBubble from '../components/features/ChatBubble';

// ── Resolve backend LAN IP the same way SemanticSearch.tsx does ──
function getBackendUrl(): string {
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost;
  if (debuggerHost) return `http://${debuggerHost.split(':')[0]}:3000`;
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}
const BACKEND_URL = getBackendUrl();

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai' as const,
    text: "Xin chào! Bạn muốn xem phim thể loại gì hôm nay?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function ChatbotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showTyping, setShowTyping] = useState(false);
  const [input, setInput] = useState('');

  const scrollRef = useRef<ScrollView>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, showTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userQuery = input.trim();

    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: userQuery,
      time: timeStr,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Show typing indicator while fetching real results
    setShowTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/search/semantic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, threshold: 0.4, limit: 5 }),
      });

      if (!response.ok) throw new Error(`Server lỗi: ${response.status}`);

      const json = await response.json();
      const movies: any[] = json.movies ?? [];

      setShowTyping(false);

      // Format AI reply from real movie results
      let aiText: string;
      if (movies.length === 0) {
        aiText = 'Hmm, I couldn\'t find a match for that. Try describing the mood, genre, or storyline differently! 🎬';
      } else {
        const list = movies
          .slice(0, 5)
          .map((m, i) => `${i + 1}. **${m.name}**${m.origin_name ? ` (${m.origin_name})` : ''}${m.year ? ` • ${m.year}` : ''} — ${Math.round(m.similarity * 100)}% match`)
          .join('\n');
        aiText = `Here are the top picks I found for you! 🌟\n\n${list}`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai' as const,
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        movieCard: movies.length > 0 ? movies[0] : null,
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      setShowTyping(false);
      console.error('[Chatbot] Fetch error:', err);
      Alert.alert('Lỗi API', err.message ?? 'Không thể kết nối đến server.');
      const errMsg = {
        id: Date.now() + 1,
        sender: 'ai' as const,
        text: '⚠️ Could not reach the search server. Make sure the backend is running and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>✨ NixAI</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerOptions}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing dots */}
        {showTyping && (
          <ChatBubble
            message={{
              id: 'typing',
              sender: 'ai',
              type: 'typing',
            }}
          />
        )}
      </ScrollView>

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.micIcon}>🎙</Text>
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          placeholder="Ask NixAI anything..."
          placeholderTextColor={Theme.colors.textTertiary}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendBtn, Theme.glows.red]}
          activeOpacity={0.8}
        >
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgBase,
  },
  header: {
    height: 56,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: {
    padding: 6,
  },
  backArrow: {
    color: Theme.colors.textPrimary,
    fontSize: 22,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Theme.typography.fontFamily,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.success,
  },
  statusText: {
    color: Theme.colors.success,
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily,
  },
  headerOptions: {
    color: Theme.colors.textTertiary,
    fontSize: 20,
  },
  chatArea: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  inputBar: {
    height: 72,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  micIcon: {
    color: Theme.colors.textTertiary,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    borderRadius: 100,
    paddingHorizontal: 16,
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: Theme.colors.textPrimary,
    fontSize: 16,
  },
});
