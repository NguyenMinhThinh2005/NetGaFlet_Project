import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/features/ChatBubble';
import { mockMovies } from '../data/mockMovies';

const tenetMovie = mockMovies.find(m => m.id === 'tenet');

const FULL_AI_TEXT = "Great taste! Here's one I think you'll obsess over — it's got the mind-bending complexity of Inception but it's much more recent. ";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hey Alex! 👋 What kind of film are you in the mood for tonight?",
    time: '9:41 PM',
  },
  {
    id: 2,
    sender: 'user',
    text: 'Something mind-bending, like Inception but newer.',
    time: '9:42 PM',
  },
];

export default function ChatbotScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [streamText, setStreamText] = useState('');
  const [streamIdx, setStreamIdx] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const startTimeoutRef = useRef(null);

  // Streaming effect — fully cleaned up on unmount
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


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamText, showTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'll find something perfect for that mood! Give me a moment... 🎬",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        height: '56px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--divider)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '22px', cursor: 'pointer', padding: '4px' }}
        >←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-primary)', fontSize: '17px', fontWeight: 600 }}>✨ NixAI</div>
          <div style={{ color: '#22C55E', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            Online
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '20px', cursor: 'pointer' }}>⋮</button>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          paddingBottom: '90px',
        }}
      >
        {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}

        {/* Streaming AI message */}
        {(streamText || showCard) && (
          <ChatBubble message={{
            id: 'stream',
            sender: 'ai',
            text: streamText,
            streaming: streamIdx < FULL_AI_TEXT.length,
            time: '9:43 PM',
            movieCard: showCard ? tenetMovie : null,
          }} />
        )}

        {/* Typing indicator */}
        {showTyping && <ChatBubble message={{ id: 'typing', type: 'typing', sender: 'ai' }} />}
      </div>

      {/* Input bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--divider)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 16px',
      }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '20px', cursor: 'pointer' }}>🎙</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask NixAI anything..."
          style={{
            flex: 1,
            height: '40px',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--divider)',
            borderRadius: '100px',
            padding: '0 16px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-family)',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary)',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--glow-red)',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
