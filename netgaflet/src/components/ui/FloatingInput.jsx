import { useState } from 'react';

export default function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  id,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isFloated = focused || value;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <input
        id={id}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          height: '56px',
          background: 'var(--surface)',
          border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--divider)'}`,
          borderRadius: 'var(--r-card)',
          padding: isFloated ? '20px 48px 8px 16px' : '0 48px 0 16px',
          color: 'var(--text-primary)',
          fontSize: '15px',
          fontFamily: 'var(--font-family)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? '0 0 0 3px rgba(229,9,20,0.12)' : 'none',
        }}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '16px',
          top: isFloated ? '9px' : '50%',
          transform: isFloated ? 'none' : 'translateY(-50%)',
          fontSize: isFloated ? '11px' : '14px',
          color: focused ? 'var(--primary)' : isFloated ? 'var(--text-tertiary)' : 'var(--text-tertiary)',
          fontFamily: 'var(--font-family)',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: isFloated ? 500 : 400,
        }}
      >
        {label}
      </label>

      {/* Eye toggle for password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(v => !v)}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
