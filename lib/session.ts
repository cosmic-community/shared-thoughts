export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `session_${timestamp}_${randomPart}`;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('pixel-session-id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('pixel-session-id', sessionId);
  }
  return sessionId;
}