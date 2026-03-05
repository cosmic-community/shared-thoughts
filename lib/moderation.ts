// Simple content moderation that checks for inappropriate color patterns
// and validates input text against a blocklist

const BLOCKED_WORDS: string[] = [
  'hate', 'kill', 'die', 'nazi', 'porn', 'xxx',
  'fuck', 'shit', 'ass', 'dick', 'bitch',
  'racist', 'slur', 'n1gg', 'f4g', 'r3tard',
];

export function moderateText(text: string): { approved: boolean; reason?: string } {
  if (!text || text.trim().length === 0) {
    return { approved: true };
  }

  const lower = text.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const word of BLOCKED_WORDS) {
    const cleanWord = word.replace(/[^a-z0-9]/g, '');
    if (lower.includes(cleanWord)) {
      return {
        approved: false,
        reason: 'Your submission contains inappropriate content. Please try again.',
      };
    }
  }

  return { approved: true };
}

export function moderateColor(color: string): { approved: boolean; reason?: string } {
  // All single colors are acceptable
  if (!color || color.length === 0) {
    return { approved: false, reason: 'Please select a color.' };
  }

  // Validate hex color format
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  if (!hexPattern.test(color)) {
    return { approved: false, reason: 'Invalid color format.' };
  }

  return { approved: true };
}