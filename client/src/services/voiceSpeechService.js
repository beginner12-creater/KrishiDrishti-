/**
 * KrishiDrishti AI - Web Speech API Voice Text-to-Speech Engine
 * Provides instant spoken audio in Hindi/Marathi for low-literacy farmers.
 */

let currentUtterance = null;

export function speakText(text, lang = 'hi-IN') {
  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API is not supported in this browser.');
    return false;
  }

  // Cancel any currently playing speech
  window.speechSynthesis.cancel();

  if (!text) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language to Hindi (hi-IN) or Marathi (mr-IN)
  utterance.lang = lang === 'mr' ? 'mr-IN' : 'hi-IN';
  utterance.rate = 0.9; // Slightly slower, clear speech rate for rural comprehension
  utterance.pitch = 1.0;

  // Try to find native Hindi/Marathi voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find(v => 
    v.lang.startsWith(lang === 'mr' ? 'mr' : 'hi') || 
    v.lang.includes('IN') || 
    v.name.includes('Hindi') || 
    v.name.includes('India')
  );

  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking() {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}
