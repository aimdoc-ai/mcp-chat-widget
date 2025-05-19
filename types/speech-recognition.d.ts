/**
 * Type definitions for the Web Speech API - SpeechRecognition
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
 */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

/**
 * Error event that occurs during speech recognition
 */
interface SpeechRecognitionErrorEvent extends Event {
  error: SpeechRecognitionErrorCode;
  message: string;
}

/**
 * Error codes for speech recognition
 */
type SpeechRecognitionErrorCode = 
  | 'aborted'          // Speech recognition was aborted
  | 'audio-capture'    // Audio capture failed
  | 'bad-grammar'      // Grammar compilation failed
  | 'language-not-supported' // Language not supported
  | 'network'          // Network communication failed
  | 'no-speech'        // No speech detected
  | 'not-allowed'      // User denied permission
  | 'service-not-allowed' // Service not allowed
  | 'other';           // Other errors

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
  onend: () => void;
}

// Use declaration merging to extend Window interface
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
} 