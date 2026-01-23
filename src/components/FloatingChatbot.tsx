import React, { useState, useRef, useEffect, useCallback } from 'react';
// Import avatar media via Vite-compatible URLs so bundler resolves them correctly
const AVATAR_SPEAK_CLOSED = new URL('/RehabBotSpeaking3.mp4', import.meta.url).href;
const AVATAR_SPEAK_HEADER = new URL('/RehabBotSpeaking4.mp4', import.meta.url).href;
const AVATAR_IDLE_VIDEO = new URL('/RehabBotIdle2.mp4', import.meta.url).href;
const AVATAR_POSTER = new URL('/RehabBotIdle.png', import.meta.url).href;
import { X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type UserRole = 'Staff' | null;

interface FloatingChatbotProps {
  kpiData?: {
    overallIndex: number;
    trend: number;
    bestDimension: { name: string; score: number };
    lowestDimension: { name: string; score: number };
    totalRespondents: number;
  };
  processedDashboardData?: any;
  // Note: unused props removed for clarity
  role?: 'Staff';
}


const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  kpiData,
  processedDashboardData,
  role = 'Staff',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'talking' | 'success'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const successTimeoutRef = useRef<number | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoRefClosed = useRef<HTMLVideoElement>(null);
  const videoRefHeader = useRef<HTMLVideoElement>(null);
  const idleVideoRefClosed = useRef<HTMLVideoElement>(null);
  const idleVideoRefHeader = useRef<HTMLVideoElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use role from props
  const selectedRole: UserRole = role || null;

  // Get suggested questions based on role
  const getSuggestedQuestions = (): string[] => {
    if (!selectedRole) {
      return [
        "Performance snapshot",
        "Performance stability & trends",
        "Dimension comparison",
        "Dimension score breakdown"
      ];
    }

    if (selectedRole === 'Staff') {
      return [
        "Performance snapshot",
        "Performance stability & trends",
        "Dimension comparison",
        "Dimension score breakdown",
        "Top-performing dimension",
        "Priority improvement area",
        "How to interpret charts",
        "Strategic improvement focus",
        "Recommended next actions",
        "How KPIs are calculated",
        "What each metric measures"
      ];
    }
    return [];
  };

  // Handle suggested question click
  const handleSuggestionClick = (question: string) => {
    setInputValue('');
    setShowSuggestions(false);
    
    // Remove emoji and clean the question text for processing
    const userMessageText = question.replace(/[📊📈⚖️💪🚀🔢📋⭐⚠️📉💡❓]/g, '').trim();
    
    // Create and send the message directly
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponseText = getBotResponse(userMessageText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      setShowSuggestions(true); // Show suggestions again after response
      
      // Set avatar to talking immediately to avoid interim success image
      setAvatarState('talking');
      // Speak the bot's response
      speakText(botResponseText);
    }, 1000 + Math.random() * 1000);
  };

  // Function to generate speech using ElevenLabs voice cloning (if API key is available)
  // This will use VoiceProf.ogg as the voice model to speak the actual response text
  const speakWithElevenLabs = useCallback(async (text: string): Promise<boolean> => {
    // Get API key from environment variable or use a default (you should set this)
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || ''; // Voice ID after cloning VoiceProf.ogg
    
    if (!apiKey || !voiceId) {
      return false; // Fallback to browser TTS
    }

    try {
      // Clean the text
      const cleanText = text
        .replace(/\n+/g, '. ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return false;

      // Call ElevenLabs API to generate speech
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs API error:', response.statusText);
        return false;
      }

      // Get audio blob and play it
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      // Set up event handlers
      audio.onplay = () => {
        setIsSpeaking(true);
        setAvatarState('talking');
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setAvatarState('success');
        successTimeoutRef.current = window.setTimeout(() => {
          setAvatarState('idle');
          successTimeoutRef.current = null;
        }, 2000);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setIsSpeaking(false);
        setAvatarState('idle');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        return false;
      };

      // Play the audio
      await audio.play();
      return true;
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      return false;
    }
  }, []);

  // Function to speak text using Text-to-Speech
  // This will speak the actual response text to the user
  // First tries ElevenLabs (if configured), then falls back to browser TTS
  const speakText = useCallback(async (text: string) => {
    // Cancel any ongoing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    // Stop any playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    // Try ElevenLabs first (if API key is configured)
    const usedElevenLabs = await speakWithElevenLabs(text);
    if (usedElevenLabs) {
      return; // Successfully used ElevenLabs
    }

    // Fallback to browser TTS
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Clean the text - remove markdown and extra whitespace
    const cleanText = text
      .replace(/\n+/g, '. ') // Replace multiple newlines with periods
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    if (!cleanText) return;

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure speech settings
    utterance.rate = 0.95; // Slightly slower for more natural sound
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    // Prioritize neural/premium voices, then natural voices, then standard voices
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.includes('Neural') || 
        voice.name.includes('Premium') || 
        voice.name.includes('Natural') ||
        voice.name.includes('Enhanced')
      )
    ) || voices.find(voice => 
      voice.lang.includes('en-US') && (
        voice.name.includes('Samantha') || 
        voice.name.includes('Alex') ||
        voice.name.includes('Victoria')
      )
    ) || voices.find(voice => voice.lang.includes('en-US')) || voices.find(voice => voice.lang.includes('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set up event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarState('talking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Show success state briefly, then return to idle
      setAvatarState('success');
      successTimeoutRef.current = window.setTimeout(() => {
        setAvatarState('idle');
        successTimeoutRef.current = null;
      }, 2000);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setAvatarState('idle');
      speechSynthesisRef.current = null;
    };

    // Store reference and speak
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speakWithElevenLabs]);

  // Initialize chatbot - show friendly greeting when opened
  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0) {
      // Add friendly greeting message
      const greetingMessage: Message = {
        id: 'greeting-' + Date.now(),
        text: "Hi! I'm RehabBot. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
      setShowSuggestions(true);
      // Start speaking greeting and set avatar to talking to avoid showing RB icon
      setAvatarState('talking');
      speakText(greetingMessage.text).catch(() => {
        // ignore speak errors for greeting
      });
    }
  }, [isOpen, isMinimized]);

  // Load voices when component mounts or when voices change
  useEffect(() => {
    const loadVoices = () => {
      // Force voice list refresh
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        speechSynthesisRef.current = null;
      }
    };
  }, []);

  // Control video playback based on speaking state
  useEffect(() => {
    if (isSpeaking && avatarState === 'talking') {
      // Pause idle video when speaking starts
      idleVideoRefClosed.current?.pause();
      idleVideoRefHeader.current?.pause();
      // Play speaking video when speaking starts - use a small timeout to ensure video element is rendered
      const playVideo = () => {
        videoRefClosed.current?.play().catch(err => console.error('Error playing video (closed):', err));
        videoRefHeader.current?.play().catch(err => console.error('Error playing video (header):', err));
      };
      // Small delay to ensure video element is in DOM
      const timeoutId = setTimeout(playVideo, 50);
      return () => clearTimeout(timeoutId);
    } else {
      // Pause speaking video when speaking stops
      videoRefClosed.current?.pause();
      videoRefHeader.current?.pause();
      // Reset speaking video to start
      if (videoRefClosed.current) videoRefClosed.current.currentTime = 0;
      if (videoRefHeader.current) videoRefHeader.current.currentTime = 0;
    }
  }, [isSpeaking, avatarState]);

  // Control idle video playback based on avatar state
  useEffect(() => {
    if (avatarState === 'idle') {
      // Play idle video when in idle state
      const playIdleVideo = () => {
        idleVideoRefClosed.current?.play().catch(() => {
          // Silently handle video play errors - video may not exist or be unsupported
        });
        idleVideoRefHeader.current?.play().catch(() => {
          // Silently handle video play errors - video may not exist or be unsupported
        });
      };
      // Small delay to ensure video element is in DOM
      const timeoutId = setTimeout(playIdleVideo, 50);
      return () => clearTimeout(timeoutId);
    } else {
      // Pause idle video when not in idle state
      idleVideoRefClosed.current?.pause();
      idleVideoRefHeader.current?.pause();
    }
  }, [avatarState]);

  // Update avatar state based on interaction
  useEffect(() => {
    // Clear any existing success timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }

    // Priority: speaking > typing > listening > success > idle
    if (isSpeaking) {
      // Bot is speaking
      setAvatarState('talking');
    } else if (isTyping) {
      // Bot is responding (typing)
      setAvatarState('talking');
    } else if (inputValue.trim().length > 0) {
      // User is typing
      setAvatarState('listening');
    } else {
      // Check if last message was from bot (show success briefly)
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.sender === 'bot' && !isTyping && !isSpeaking) {
        setAvatarState('success');
        successTimeoutRef.current = window.setTimeout(() => {
          setAvatarState('idle');
          successTimeoutRef.current = null;
        }, 2000);
      } else if (!isSpeaking) {
        setAvatarState('idle');
      }
    }

    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, [isTyping, inputValue, messages, isSpeaking]);

  // Auto-scroll disabled - user can manually scroll

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Small delay to ensure smooth animation completes
      const timer = setTimeout(() => {
      inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close chat with Escape key when open
      if (e.key === 'Escape' && isOpen && !isMinimized) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isMinimized]);

  // Helper function to analyze and format dimension data
  const getDimensionAnalysis = () => {
    if (!processedDashboardData?.dimensionsData) return null;
    
    const dimensions = processedDashboardData.dimensionsData.map((d: any) => ({
      name: d.label,
      score: d.current || 0,
    })).sort((a: any, b: any) => b.score - a.score);
    
    return {
      all: dimensions,
      highest: dimensions[0],
      lowest: dimensions[dimensions.length - 1],
    };
  };

  // Helper function to get actionable suggestions for dimensions (for lowest/improvement)
  const getDimensionSuggestions = (dimensionName: string): string => {
    const suggestions: { [key: string]: string } = {
      'Trainee Orientation': 'focus on understanding individual trainee needs, regularly assess satisfaction, and tailor programs to unique abilities',
      'Performance Orientation': 'establish clear performance metrics, implement regular monitoring systems, and commit resources to service excellence',
      'Competitor Orientation': 'monitor competitor activities, learn from best practices in other centers, and differentiate your services',
      'Long-term Focus': 'develop strategic plans, invest in sustainable resources, and emphasize continuous improvement initiatives',
      'Inter-functional Coordination': 'improve inter-departmental communication, establish regular coordination meetings, and promote collaborative practices',
      'Employee Orientation': 'invest in staff training programs, enhance employee motivation, and ensure adequate staffing levels',
    };
    return suggestions[dimensionName] || 'review current practices and identify specific areas for improvement';
  };

  // Helper function to convert 0-7 scale to percentage
  const scoreToPercentage = (score: number): number => {
    return (score / 7.0) * 100;
  };

  // Helper function to get RehabServE Index status based on percentage
  const getRehabServEStatus = (percentage: number): string => {
    if (percentage >= 93) return 'Outstanding';
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 85) return 'Very Good';
    if (percentage >= 80) return 'Good';
    return 'Needs Improvement';
  };
  
  // Helper function to remove markdown symbols
  const removeMarkdown = (text: string): string => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/`/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/📊|📈|🎯|💡|📉|📋/g, '');
  };

  // Helper function to check if message is role selection
  const isRoleSelection = (message: string): UserRole | null => {
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage === 'staff' || lowerMessage === '1') return 'Staff';
    return null;
  };
  // Role-specific response formatter
  const formatForStaff = (response: string): string => {
    return removeMarkdown(response);
  };
  
  // --- Response variation state & helpers (implements user's rules) ---
  const [overallSummaryShown, setOverallSummaryShown] = useState(false);
  const lastPerspectiveRef = useRef<string | null>(null);
  const lastContentTypeRef = useRef<string | null>(null);
  const intentCountsRef = useRef<Record<string, number>>({});
  const lastIntentRef = useRef<string | null>(null);
  const lastIntentTimeRef = useRef<number | null>(null);

  const PERSPECTIVES = ['Executive', 'Analytical', 'Advisory', 'Reassuring', 'Strategic'];

  const pickNextPerspective = () => {
    const last = lastPerspectiveRef.current;
    const options = PERSPECTIVES.filter(p => p !== last);
    const next = options[Math.floor(Math.random() * options.length)];
    lastPerspectiveRef.current = next;
    return next;
  };

  const detectIntent = (text: string): string => {
    const t = text.toLowerCase();
    // Priority order -> only one intent returned
    if (t.includes('performance snapshot') || t.match(/(see overall|show overall|overall performance|kpi|index|current performance)/)) return 'overall';
    if (t.includes('stability') || t.includes('performance stability') || t.includes('trends') || t.match(/(trend|trends|changing|improving|declining|direction)/)) return 'trends';
    if (t.includes('dimension comparison') || t.includes('compare')) return 'compare';
    if (t.includes('dimension score breakdown') || t.includes('score breakdown') || t.includes('show all') || t.includes('dimension score')) return 'dimensions';
    if (t.includes('top-performing') || t.includes('top performing') || t.includes('top-performing dimension') || t.includes('best area')) return 'strengths';
    if (t.includes('priority improvement') || t.includes('priority') || t.includes('what needs attention') || t.includes('needs attention')) return 'areas';
    if (t.includes('strategic improvement') || t.includes('how can we improve') || t.includes('how to improve') || t.includes('recommended next actions') || t.includes('actions')) return 'improve';
    if (t.includes('what each metric') || t.includes('what each metric measures') || t.includes('understanding metrics') || t.includes('what each metric')) return 'meaning';
    if (t.includes('how kpi') || t.includes('how kpis') || t.includes('how kpi') || t.includes('how kpis are calculated') || t.includes('how kpis are') || t.includes('how kpis')) return 'kpi';
    if (t.includes('interpret charts') || t.includes('how to interpret') || t.includes('interpret chart')) return 'charts';
    if (t.includes('help') || t.includes('what can')) return 'help';
    return 'default';
  };

  // Analytics-focused bot response system (implements Response Variation Rules)
  const getBotResponse = (userMessage: string): string => {
    const raw = userMessage.trim();
    const message = raw.toLowerCase();

    // Role selection check
    const roleSelection = isRoleSelection(raw);
    if (roleSelection) {
      return "Please select your role from the sidebar menu. Your role selection will customize my responses to better assist you.";
    }
    if (!selectedRole) {
      return "Please select your role from the sidebar menu: Staff.";
    }

    const intent = detectIntent(message);

    // Update intent counts and timing (for progressive depth & compression)
    const now = Date.now();
    lastIntentRef.current = intent;
    lastIntentTimeRef.current = now;
    intentCountsRef.current[intent] = (intentCountsRef.current[intent] || 0) + 1;

    // Helper to respect clinical tone and no-data fallbacks
    const safe = (text: string) => formatForStaff(text);

    const dimAnalysis = getDimensionAnalysis();

    // Perspective rotation (avoid repeating same perspective twice)
    pickNextPerspective();

    // Templates provided by user (clinical tone)
    switch (intent) {
      case 'overall': {
        if (!kpiData) {
          return safe("Data unavailable. Ensure the dashboard is loaded and try again.");
        }
        if (!overallSummaryShown) {
          setOverallSummaryShown(true);
          lastContentTypeRef.current = 'snapshot';
          return safe(`Overall performance is very good.\nThe RehabServE Index stands at ${scoreToPercentage(kpiData.overallIndex).toFixed(1)}%, indicating stable and consistent service performance across measured dimensions.\nNo immediate risks were detected based on the current data set (n = ${kpiData.totalRespondents}).`);
        }
        // After first time - concise reference
        lastContentTypeRef.current = 'snapshot';
        return safe(`Performance remains stable and within the ${getRehabServEStatus(scoreToPercentage(kpiData.overallIndex))} range.\nNo significant changes have been observed since the last review.`);
      }

      case 'trends': {
        if (!kpiData) return safe("Trend data unavailable.");
        lastContentTypeRef.current = 'trends';
        return safe(`Performance levels have remained consistent, with no notable upward or downward shifts detected.\nThis suggests operational stability rather than short-term fluctuation.`);
      }

      case 'compare': {
        if (!kpiData || !kpiData.bestDimension) return safe("Dimension comparison data unavailable.");
        // Return ranked list (highest -> lowest) without explanations
        const dims = (processedDashboardData?.dimensionsData || []).map((d: any) => d.label);
        // Fallback to kpiData dimensions if processedDashboardData unavailable
        const ranked = dims.length > 0 ? dims : [kpiData.bestDimension?.name, kpiData.lowestDimension?.name].filter(Boolean);
        lastContentTypeRef.current = 'comparison';
        return safe(`Dimension ranking (highest → lowest):\n\n${ranked.join('\n')}`);
      }

      case 'strengths': {
        if (!kpiData || !kpiData.bestDimension) return safe("Best-area data unavailable.");
        const dim = kpiData.bestDimension;
        lastContentTypeRef.current = 'strengths';
        return safe(`${dim.name} is your strongest dimension.\nThis reflects a clear commitment to service excellence, structured evaluation, and outcome tracking.`);
      }

      case 'areas': {
        if (!kpiData || !kpiData.lowestDimension) return safe("Area needing attention data unavailable.");
        const dim = kpiData.lowestDimension;
        lastContentTypeRef.current = 'areas';
        return safe(`${dim.name} shows the most room for improvement.`);
      }

      case 'improve': {
        const target = kpiData?.lowestDimension?.name || 'Competitor Orientation';
        const suggestion = getDimensionSuggestions(target);
        lastContentTypeRef.current = 'actions';
        // Actions only — no metrics or restated scores
        return safe(`Recommended next actions to strengthen ${target}:\n• ${suggestion.replace(/, /g, '\n• ')}\n\nThese steps focus on implementation rather than measurement.`);
      }

      case 'meaning': {
        lastContentTypeRef.current = 'meaning';
        // Interpretation only — avoid repeating raw numbers unless explicitly requested
        const status = kpiData ? getRehabServEStatus(scoreToPercentage(kpiData.overallIndex)) : 'N/A';
        return safe(`Interpretation: RehabServE is currently assessed as ${status}.\nThis reflects reliable performance with targeted opportunities for refinement rather than corrective action.`);
      }

      case 'kpi': {
        lastContentTypeRef.current = 'methodology';
        return safe(`KPI calculation (method):\nRehabServE Index = aggregated averages of dimension scores (0-7 scale). Percent = (score / 7) × 100. Status bands are applied to percentiles for benchmarking.`);
      }

      case 'reassurance': {
        return safe(`There are no warning signals in the current data.\nPerformance is stable, and results are consistent with previous measurements.`);
      }

      case 'dimensions': {
        if (!dimAnalysis) return safe("Dimension scores are unavailable.");
        // Return raw values only (no interpretation)
        const lines = dimAnalysis.all.map((dim: any) => {
          const pct = scoreToPercentage(dim.score);
          return `${dim.name}: ${dim.score.toFixed(2)}/7.0 (${pct.toFixed(1)}%)`;
        });
        lastContentTypeRef.current = 'scores';
        return safe(`Dimension score breakdown (values only):\n\n${lines.join('\n')}`);
      }

      case 'help': {
        return safe(`I can summarize your dashboard, explain trends, compare dimensions, list improvement actions, or show how KPIs are calculated. Which would you like?`);
      }

      default:
        return safe(`I'm here to help. Ask about overall performance, trends, dimensions, or improvement actions.`);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false); // Hide suggestions when user sends a message

    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponseText = getBotResponse(userMessageText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      setShowSuggestions(true); // Show suggestions again after bot responds
      
      // Set avatar to talking immediately to avoid interim success image
      setAvatarState('talking');
      // Speak the bot's response
      speakText(botResponseText);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    // Stop any ongoing speech when closing
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
    // Stop any playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Get avatar image path based on avatar state
  // Fallback to a placeholder or use video if images don't exist
  const getAvatarImagePath = () => {
    // Return poster image (imported) as fallback for broken/missing videos
    return AVATAR_POSTER;
  };

  // Get animation class based on avatar state
  const getAvatarAnimationClass = () => {
    switch (avatarState) {
      case 'idle':
        return 'avatar-idle';
      case 'listening':
        return 'avatar-listening';
      case 'talking':
        return 'avatar-talking';
      case 'success':
        return 'avatar-success';
      default:
        return 'avatar-idle';
    }
  };

  // Hornbill character button (when closed)
  if (!isOpen) {
    return (
      <>
        <style>{`
          @keyframes blink {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0.3; }
          }
          
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.015); }
          }
          
          @keyframes listen {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-3px) rotate(3deg) scale(0.98); }
          }
          
          @keyframes talk {
            0%, 100% { 
              transform: scale(1, 1) translateY(0) rotate(0deg);
            }
            12.5% { 
              transform: scale(1.05, 1.08) translateY(-1px) rotate(-0.5deg);
            }
            25% { 
              transform: scale(0.98, 0.95) translateY(1px) rotate(0.5deg);
            }
            37.5% { 
              transform: scale(1.05, 1.08) translateY(-1px) rotate(-0.5deg);
            }
            50% { 
              transform: scale(0.98, 0.95) translateY(1px) rotate(0.5deg);
            }
            62.5% { 
              transform: scale(1.05, 1.08) translateY(-1px) rotate(-0.5deg);
            }
            75% { 
              transform: scale(0.98, 0.95) translateY(1px) rotate(0.5deg);
            }
            87.5% { 
              transform: scale(1.05, 1.08) translateY(-1px) rotate(-0.5deg);
            }
          }
          
          @keyframes successNod {
            0% { transform: translateY(0) scale(1) rotate(0deg); }
            30% { transform: translateY(-4px) scale(1.02) rotate(-2deg); }
            60% { transform: translateY(0) scale(1) rotate(0deg); }
            100% { transform: translateY(0) scale(1) rotate(0deg); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px) translateX(-50%); }
            100% { opacity: 1; transform: translateY(0) translateX(-50%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(-50%); }
            50% { transform: translateY(-3px) translateX(-50%); }
          }
          
          .avatar-idle {
            animation: breathe 3s ease-in-out infinite, blink 4s ease-in-out infinite;
          }
          
          .avatar-listening {
            animation: listen 2.5s ease-in-out infinite;
          }
          
          .avatar-talking {
            animation: talk 0.5s ease-in-out infinite;
            filter: brightness(1.05);
          }
          
          .avatar-success {
            animation: successNod 1s ease-in-out;
          }
        `}</style>
        <div className="fixed bottom-6 left-6 z-[100]">
          <button
            onClick={handleToggleChat}
            className="group relative transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Open chatbot"
            role="button"
            tabIndex={0}
          >
            {/* Speech Bubble with Friendly Greeting */}
            <div className="absolute -top-20 left-1/2 mb-3" style={{ 
              animation: 'fadeIn 0.5s ease-out forwards, float 3s ease-in-out infinite 0.5s',
              transform: 'translateX(-50%)'
            }}>
              <div className="relative bg-white rounded-2xl shadow-lg px-4 py-2.5 max-w-[160px] border-2 border-gray-200">
                <p className="text-sm text-gray-800 font-medium leading-tight text-center whitespace-nowrap">
                  I'm RehabBot
                </p>
                {/* Speech Bubble Tail - pointing to avatar */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[2px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-200"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  {avatarState === 'talking' ? (
                    <video 
                      ref={videoRefClosed}
                      id="hornbillAvatar"
                      src={AVATAR_SPEAK_CLOSED}
                      loop
                      muted
                      playsInline
                      preload="auto"
                      poster={AVATAR_POSTER}
                      onError={(e) => {
                        console.error('Closed avatar video error:', e);
                        const video = e.currentTarget;
                        if (video) video.style.display = 'none';
                      }}
                      className="w-[140px] h-[140px] rounded-full object-cover bg-transparent"
                      style={{ border: 'none', outline: 'none' }}
                    />
                  ) : (avatarState === 'idle' || avatarState === 'success') ? (
                    <video 
                      ref={idleVideoRefClosed}
                      id="hornbillAvatar"
                      src={AVATAR_IDLE_VIDEO}
                      loop
                      muted
                      playsInline
                      autoPlay
                      onError={(e) => {
                        console.error('Idle avatar video error (closed):', e);
                        const video = e.currentTarget;
                        if (video) video.style.display = 'none';
                      }}
                      className="w-[140px] h-[140px] rounded-full object-cover bg-transparent"
                      style={{ border: 'none', outline: 'none' }}
                    />
                  ) : (
                    <img 
                      id="hornbillAvatar"
                      src={getAvatarImagePath()}
                      alt="RehabBot"
                  className={`w-[180px] h-[180px] rounded-full object-cover bg-transparent ${getAvatarAnimationClass()}`}
                    />
                  )}
                </div>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 92%, 100% { opacity: 1; }
          94%, 96% { opacity: 0.4; }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes listen {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-4px) rotate(4deg) scale(0.99); }
        }
        
        @keyframes talk {
          0%, 100% { 
            transform: scale(1, 1) translateY(0) rotate(0deg);
          }
          12.5% { 
            transform: scale(1.06, 1.1) translateY(-2px) rotate(-0.5deg);
          }
          25% { 
            transform: scale(0.97, 0.93) translateY(2px) rotate(0.5deg);
          }
          37.5% { 
            transform: scale(1.06, 1.1) translateY(-2px) rotate(-0.5deg);
          }
          50% { 
            transform: scale(0.97, 0.93) translateY(2px) rotate(0.5deg);
          }
          62.5% { 
            transform: scale(1.06, 1.1) translateY(-2px) rotate(-0.5deg);
          }
          75% { 
            transform: scale(0.97, 0.93) translateY(2px) rotate(0.5deg);
          }
          87.5% { 
            transform: scale(1.06, 1.1) translateY(-2px) rotate(-0.5deg);
          }
        }
        
        @keyframes successNod {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          25% { transform: translateY(-5px) scale(1.03) rotate(-2deg); }
          50% { transform: translateY(0) scale(1) rotate(0deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        
        .avatar-idle {
          animation: breathe 3.5s ease-in-out infinite, blink 4.5s ease-in-out infinite;
        }
        
        .avatar-listening {
          animation: listen 2.5s ease-in-out infinite;
        }
        
        .avatar-talking {
          animation: talk 0.5s ease-in-out infinite;
          filter: brightness(1.05);
        }
        
        .avatar-success {
          animation: successNod 1.2s ease-in-out;
        }
        
        video {
          border: none !important;
          outline: none !important;
          background: transparent !important;
        }
        
        video:focus {
          outline: none !important;
          border: none !important;
        }
      `}</style>
      <div
        ref={chatContainerRef}
        className="fixed bottom-6 left-6 z-[100] bg-white rounded-3xl shadow-2xl transition-all duration-300 w-[260px] h-[420px] max-h-[85vh] flex flex-col overflow-hidden backdrop-blur-sm"
        role="dialog"
        aria-label="Chatbot conversation"
        aria-modal="true"
        style={{
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3)',
          background: 'white',
        }}
      >
      {/* Background pattern with icons */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
          }}></div>
        </div>
        
      {/* Header with Avatar */}
      <div className="relative flex flex-col items-center pt-4 pb-3 px-4 flex-shrink-0">
        {/* Close button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/30 text-gray-600 hover:text-gray-900"
            aria-label="Close chat"
            tabIndex={0}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

          {/* Avatar without frame */}
          <div className="relative mb-2 flex items-center justify-center">
                {avatarState === 'talking' ? (
                  <video 
                    ref={videoRefHeader}
                    id="hornbillAvatarHeader"
                    src={AVATAR_SPEAK_HEADER}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster={AVATAR_POSTER}
                    onError={(e) => {
                      console.error('Header speaking video error:', e);
                      const video = e.currentTarget;
                      if (video) video.style.display = 'none';
                    }}
                    className="w-[120px] h-[120px] rounded-full object-cover bg-transparent"
                    style={{ border: 'none', outline: 'none' }}
                  />
                ) : (avatarState === 'idle' || avatarState === 'success') ? (
                  <video 
                    ref={idleVideoRefHeader}
                    id="hornbillAvatarHeader"
                    src={AVATAR_IDLE_VIDEO}
                    loop
                    muted
                    playsInline
                    autoPlay
                    onError={(e) => {
                      console.error('Idle avatar video error (header):', e);
                      const video = e.currentTarget;
                      if (video) video.style.display = 'none';
                    }}
                    className="w-[120px] h-[120px] rounded-full object-cover bg-transparent"
                    style={{ border: 'none', outline: 'none' }}
                  />
                ) : (
                  <img 
                    id="hornbillAvatarHeader"
                    src={getAvatarImagePath()}
                    alt="RehabBot"
                 className={`w-[160px] h-[160px] rounded-full object-cover bg-transparent ${getAvatarAnimationClass()}`}
                  />
                )}
              </div>
        
        {/* Centered text */}
        <div className="text-center relative z-10">
          <h2 className="text-gray-900 text-sm font-medium mb-0">
            Ask RehabBot anything
          </h2>
        </div>
      </div>

          {/* Messages Area */}
          <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth relative z-10"
            role="log"
            aria-label="Chat messages"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                role="listitem"
              >
                <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-md transition-all duration-200 ${
                    message.sender === 'user'
                          ? 'bg-gradient-to-br from-[#CE1126] to-[#FCD106] text-white rounded-br-sm shadow-[#CE1126]/30'
                          : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                      <p className="text-xs whitespace-pre-wrap leading-relaxed font-normal">{message.text}</p>
                  <p
                        className={`text-[10px] mt-1.5 font-medium ${
                          message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                    }`}
                    aria-label={`Message sent at ${message.timestamp.toLocaleTimeString()}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in" role="status" aria-live="polite">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-[#CE1126] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#FCD106] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#CE1126] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-600 ml-2">Crunching the numbers…</span>
                    </div>
                </div>
              </div>
            )}

            {/* Suggested Questions - Show when no messages or after bot response */}
            {showSuggestions && !isTyping && (
              <div className="flex flex-col gap-1.5 mt-2">
                {getSuggestedQuestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-white bg-[#CE1126] hover:bg-[#B01020] border border-[#CE1126] rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 shadow-md flex items-center gap-2 min-h-[32px]"
                    aria-label={`Ask: ${question}`}
                  >
                    <span className="flex-1 text-white leading-tight">{question}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state when no messages yet (besides greeting) */}
            {messages.length <= 1 && !isTyping && !showSuggestions && (
              <div className="flex justify-center items-center py-8 text-center">
                <p className="text-sm text-gray-500">
                  No data yet — once available, I'll help analyze it 😊
                </p>
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Input Area */}
      <div className="border-t border-gray-200 p-1 bg-white rounded-b-3xl flex-shrink-0 relative z-10">
            <div className="flex space-x-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 Ask me anything..."
                className="flex-1 px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:border-[#CE1126]/50 text-sm transition-all bg-white text-gray-900 placeholder-gray-500 shadow-sm hover:bg-gray-50 min-h-[44px]"
                aria-label="Type your question"
                aria-describedby="send-button"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-br from-[#CE1126] to-[#FCD106] text-white px-4 py-2.5 rounded-lg hover:from-[#B01020] hover:to-[#E0C106] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:ring-offset-2 focus:ring-offset-white shadow-lg hover:shadow-xl active:scale-95 disabled:shadow-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Send message"
                id="send-button"
                tabIndex={0}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 text-center font-medium">
              Press Enter to send • Esc to close
            </p>
          </div>
    </div>
    </>
  );
};

export default FloatingChatbot;

