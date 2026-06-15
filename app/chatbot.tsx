import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../constants/Theme';
import ChatBubble from '../components/features/ChatBubble';
import { mockMovies } from '../data/mockMovies';

const tenetMovie = mockMovies.find(m => m.id === 'tenet');

const FULL_AI_TEXT = "Great taste! Here's one I think you'll obsess over — it's got the mind-bending complexity of Inception but it's much more recent. ";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai' as const,
    text: "Hey Alex! 👋 What kind of film are you in the mood for tonight?",
    time: '9:41 PM',
  },
  {
    id: 2,
    sender: 'user' as const,
    text: 'Something mind-bending, like Inception but newer.',
    time: '9:42 PM',
  },
];

export default function ChatbotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [streamText, setStreamText] = useState('');
  const [streamIdx, setStreamIdx] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [input, setInput] = useState('');

  const scrollRef = useRef<ScrollView>(null);
  const intervalRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const startTimeoutRef = useRef<any>(null);

  // Streaming effect
  useEffect(() => {
    startTimeoutRef.current = setTimeout(() => {
      setShowTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setShowTyping(false);
        intervalRef.current = setInterval(() => {
          setStreamIdx(i => {
            if (i >= FULL_AI_TEXT.length) {
              clearInterval(intervalRef.current);
              setShowCard(true);
              return i;
            }
            setStreamText(FULL_AI_TEXT.slice(0, i + 1));
            return i + 1;
          });
        }, 28);
      }, 1500);
    }, 600);

    return () => {
      clearTimeout(startTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, streamText, showTyping, showCard]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: input,
      time: timeStr,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated reply after 1s
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai' as const,
        text: "I'll find something perfect for that mood! Give me a moment... 🎬",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
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

        {/* Streaming message */}
        {(streamText.length > 0 || showCard) && (
          <ChatBubble
            message={{
              id: 'stream',
              sender: 'ai',
              text: streamText,
              streaming: streamIdx < FULL_AI_TEXT.length,
              time: '9:43 PM',
              movieCard: showCard ? tenetMovie : null,
            }}
          />
        )}

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
