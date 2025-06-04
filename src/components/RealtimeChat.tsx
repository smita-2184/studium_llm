import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, MicOff, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useOpenAIStore } from '../store/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const service = useOpenAIStore((state) => state.service);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = async () => {
    try {
      setMicError(null);
      
      // Request microphone access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      audioStreamRef.current = stream;

      // Set up speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setMicError('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);

    } catch (err) {
      console.error('Failed to start listening:', err);
      let errorMessage = 'Failed to start listening';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone access denied. Please allow access in your browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = 'Could not access microphone. It may be in use by another application.';
        }
      }
      
      setMicError(errorMessage);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!isSpeaking) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get available voices and set a natural-sounding one
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') && voice.lang === 'en-US'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !service || isStreaming) return;

    try {
      const userMessage: Message = {
        role: 'user', 
        content: input
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsStreaming(true);

      let streamedContent = '';
      await service.generateStreamingResponse(input, (chunk) => {
        streamedContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = streamedContent;
          } else {
            newMessages.push({
              role: 'assistant',
              content: streamedContent,
              isStreaming: true
            });
          }
          return newMessages;
        });

        // Speak the chunk if speech is enabled
        if (isSpeaking) {
          speakText(chunk);
        }
      });

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage?.role === 'assistant') {
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-[#2C2C2E] ml-12' 
                : 'bg-[#3A3A3C] mr-12'
            }`}
          >
            <div className="relative">
              {message.content}
              {message.isStreaming && (
                <span className="ml-1 inline-block w-2 h-4 bg-blue-500 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#3A3A3C]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-[#2C2C2E] hover:bg-[#3A3A3C]'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Type or speak your message...'}
            className="flex-1 bg-[#2C2C2E] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3A3A3C]"
            disabled={isStreaming}
          />
          
          <button
            type="button"
            onClick={toggleSpeaking}
            className="p-2 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C] transition-colors"
            title={isSpeaking ? 'Disable voice output' : 'Enable voice output'}
          >
            {isSpeaking ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-[#2C2C2E] rounded-lg hover:bg-[#3A3A3C] transition-colors"
            title="Send message"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-between">
          {isStreaming ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              AI is thinking...
            </span>
          ) : (
            isListening ? 'Speak your message...' : 'Type or speak your message'
          )}
          {micError && (
            <span className="text-red-500">
              {micError}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}