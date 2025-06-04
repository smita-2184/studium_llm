interface Window {
  webkitAudioContext: typeof AudioContext;
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
  $3Dmol: any;
}

declare namespace NodeJS {
  interface Global {
    $3Dmol: any;
  }
} 