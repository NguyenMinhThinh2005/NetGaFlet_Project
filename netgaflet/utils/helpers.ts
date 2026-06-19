export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const groupByDate = (items: any[]) => {
  const groups: Record<string, any[]> = {};
  items.forEach(item => {
    const d = new Date(item.watchedAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    let key;
    if (diff === 0) key = 'Today';
    else if (diff === 1) key = 'Yesterday';
    else if (diff < 7) key = 'This Week';
    else key = 'Earlier';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
};

export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export const getPasswordStrength = (password: string) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 3);
};

export const strengthColor = (strength: number) => {
  if (strength === 1) return '#E50914';
  if (strength === 2) return '#FF8C00';
  if (strength === 3) return '#22C55E';
  return 'transparent';
};

export const strengthLabel = (strength: number) => {
  if (strength === 1) return 'Weak';
  if (strength === 2) return 'Medium';
  if (strength === 3) return 'Strong';
  return '';
};

export function parseGradient(gradientStr: string | undefined): { colors: [string, string, ...string[]]; locations?: [number, number, ...number[]] } {
  if (!gradientStr) return { colors: ['#08080E', '#111118'] };
  
  // Extract hex colors and optional percentages
  // Example: linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%, #0a0a14 100%)
  const matches = Array.from(gradientStr.matchAll(/(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))\s*(\d+)?%/g));
  if (matches.length === 0) {
    const hexColors = gradientStr.match(/#[a-fA-F0-9]{3,8}/g);
    if (hexColors && hexColors.length >= 2) {
      return { colors: hexColors as [string, string, ...string[]] };
    }
    return { colors: ['#08080E', '#111118'] };
  }
  const colors = matches.map(m => m[1]);
  const locations = matches.map(m => m[2] ? parseInt(m[2], 10) / 100 : undefined);
  
  if (colors.length < 2) {
    colors.push('#111118');
  }
  
  const hasAllLocations = locations.every(l => l !== undefined);
  let finalLocations: [number, number, ...number[]] | undefined = undefined;
  if (hasAllLocations && locations.length >= 2) {
    finalLocations = locations as [number, number, ...number[]];
  }
  
  return {
    colors: colors as [string, string, ...string[]],
    locations: finalLocations
  };
}
