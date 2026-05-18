import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  fillerWords: Array<{ word: string; count: number; timestamp: number }>;
  communicationScore: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  getCommunicationTips: () => string[];
}

const FILLER_WORDS = [
  'uh', 'um', 'umm', 'like', 'you know', 'basically', 'actually',
  'literally', 'sort of', 'kind of', 'i mean', 'right', 'okay',
  'so', 'well', 'yeah', 'hmm', 'err'
];

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [fillerWords, setFillerWords] = useState<Array<{ word: string; count: number; timestamp: number }>>([]);
  const [communicationScore, setCommunicationScore] = useState(100);
  
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
          detectFillerWords(transcriptPiece);
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if still supposed to be listening
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const detectFillerWords = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    FILLER_WORDS.forEach((filler) => {
      const fillerPattern = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(fillerPattern);
      
      if (matches) {
        setFillerWords((prev) => {
          const existing = prev.find((f) => f.word === filler);
          if (existing) {
            return prev.map((f) =>
              f.word === filler
                ? { ...f, count: f.count + matches.length, timestamp: Date.now() }
                : f
            );
          } else {
            return [...prev, { word: filler, count: matches.length, timestamp: Date.now() }];
          }
        });
      }
    });

    // Calculate communication score
    const totalWords = words.length;
    const totalFillers = fillerWords.reduce((sum, f) => sum + f.count, 0);
    const fillerPercentage = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;
    
    // Score: 100 - (filler percentage * 2)
    const score = Math.max(0, Math.min(100, 100 - fillerPercentage * 2));
    setCommunicationScore(Math.round(score));
  }, [fillerWords]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        startTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setFillerWords([]);
    setCommunicationScore(100);
  }, []);

  const getCommunicationTips = useCallback((): string[] => {
    const tips: string[] = [];
    const totalFillers = fillerWords.reduce((sum, f) => sum + f.count, 0);

    if (totalFillers > 10) {
      tips.push('Try to reduce filler words. Pause instead of saying "um" or "uh".');
    }

    const topFillers = [...fillerWords]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    if (topFillers.length > 0) {
      tips.push(`Most used filler words: ${topFillers.map((f) => `"${f.word}" (${f.count}x)`).join(', ')}`);
    }

    if (communicationScore < 70) {
      tips.push('Practice speaking more slowly and deliberately to reduce filler words.');
      tips.push('Take brief pauses to collect your thoughts instead of using fillers.');
    } else if (communicationScore < 85) {
      tips.push('Good progress! Focus on eliminating the remaining filler words.');
    } else {
      tips.push('Excellent communication! Your speech is clear and professional.');
    }

    const speakingTime = (Date.now() - startTimeRef.current) / 1000;
    const wordsPerMinute = transcript.split(/\s+/).length / (speakingTime / 60);
    
    if (wordsPerMinute > 180) {
      tips.push('You might be speaking too fast. Try to slow down for better clarity.');
    } else if (wordsPerMinute < 100 && speakingTime > 30) {
      tips.push('Consider speaking a bit faster to maintain engagement.');
    }

    return tips;
  }, [fillerWords, communicationScore, transcript]);

  return {
    transcript,
    isListening,
    fillerWords,
    communicationScore,
    startListening,
    stopListening,
    resetTranscript,
    getCommunicationTips,
  };
}

// Made with Bob
