import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  filters?: {
    dateRange: string;
    group: string;
    dimension: string;
    pdk: string;
  };
  respondentGroupOptions?: { value: string; label: string }[];
  pdkOptions?: { value: string; label: string }[];
  dimensionMappings?: { [key: string]: { value: string } };
  role?: 'Staff';
}

// Question descriptions mapping
const QUESTION_DESCRIPTIONS: { [key: string]: string } = {
  // TO - Trainee Orientation
  'TO1': 'Constantly check the level of commitment to serve the trainees\' needs',
  'TO2': 'Care for the trainees based on a good understanding of the trainees\' needs',
  'TO3': 'Love and be patient with every trainee',
  'TO4': 'Regularly understand the trainees\' satisfaction',
  'TO5': 'Know the changes in the trainees\' preferences',
  'TO6': 'Excellent after-training service for trainees',
  // PO - Performance Management
  'PO1': 'The Rehabilitation Centre strives for service excellence',
  'PO2': 'The top management is committed to delivering excellent rehabilitation services',
  'PO3': 'Systematically and regularly measures its service performance',
  'PO4': 'Seriously monitors its rehabilitation service performance',
  'PO5': 'Provide resources to enhance trainers\' ability to provide excellent service',
  'PO6': 'Aiming for being an excellent CBR Centre',
  // CO - Competitive Orientation
  'CO1': 'Respond quickly to competitors\' actions that may threaten the Centre',
  'CO2': 'Continuously knowing the competitors to provide better service',
  'CO3': 'The target for trainees that the Centre can serve better than its competitors',
  'CO4': 'Always learn from other rehabilitation centres to care for the trainees',
  'CO5': 'Always try to be different and better than other CBR Centres',
  'CO6': 'Work with other CBR Centres and counterparts',
  // LO - Long-Term Orientation
  'LO1': 'Invest in providing excellent services to the trainees (e.g., facilities)',
  'LO2': 'Implement changes to care for the trainees in the long-term',
  'LO3': 'Emphasise the Centre\'s long-term survival',
  'LO4': 'Emphasise continuous improvement in managing its services/products',
  'LO5': 'The Centre has long-term plans in service',
  'LO6': 'Consider serving the trainees well as a worthwhile long-term investment',
  'LO7': 'The Centre consistently emphasises service excellence',
  'LO8': 'Generate income for sustainability of the Centre',
  // IO - Internal Communication
  'IO1': 'The employees communicate and "talk" about how to care for the trainees better',
  'IO2': 'Trainee information is freely distributed in the Centre (e.g., notices)',
  'IO3': 'The employees of different departments in the Centre have good relationships',
  'IO4': 'During any activity involving various departments, there is good coordination',
  'IO5': 'There is good communication between the different departments/units in the Centre',
  'IO6': 'Work with external organisations',
  // EO - Employee Management
  'EO1': 'The employees of the Centre are well trained',
  'EO2': 'Employees who interact with the trainees are always motivated or joyful',
  'EO3': 'The Centre have sufficient staff to deliver quality service',
  'EO4': 'The Centre chooses suitable staff to interact or deal with the trainees',
  'EO5': 'Motivate trainers to love and care for the trainers',
  'EO6': 'Encourage employees to have a good relationship with parents',
};

// Question ID to Dimension mapping
const QUESTION_TO_DIMENSION: { [key: string]: string } = {
  'TO1': 'Trainee Orientation', 'TO2': 'Trainee Orientation', 'TO3': 'Trainee Orientation',
  'TO4': 'Trainee Orientation', 'TO5': 'Trainee Orientation', 'TO6': 'Trainee Orientation',
  'PO1': 'Performance Orientation', 'PO2': 'Performance Orientation', 'PO3': 'Performance Orientation',
  'PO4': 'Performance Orientation', 'PO5': 'Performance Orientation', 'PO6': 'Performance Orientation',
  'CO1': 'Competitor Orientation', 'CO2': 'Competitor Orientation', 'CO3': 'Competitor Orientation',
  'CO4': 'Competitor Orientation', 'CO5': 'Competitor Orientation', 'CO6': 'Competitor Orientation',
  'LO1': 'Long-term Focus', 'LO2': 'Long-term Focus', 'LO3': 'Long-term Focus',
  'LO4': 'Long-term Focus', 'LO5': 'Long-term Focus', 'LO6': 'Long-term Focus',
  'LO7': 'Long-term Focus', 'LO8': 'Long-term Focus',
  'IO1': 'Inter-functional Coordination', 'IO2': 'Inter-functional Coordination', 'IO3': 'Inter-functional Coordination',
  'IO4': 'Inter-functional Coordination', 'IO5': 'Inter-functional Coordination', 'IO6': 'Inter-functional Coordination',
  'EO1': 'Employee Orientation', 'EO2': 'Employee Orientation', 'EO3': 'Employee Orientation',
  'EO4': 'Employee Orientation', 'EO5': 'Employee Orientation', 'EO6': 'Employee Orientation',
};

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  kpiData,
  processedDashboardData,
  filters,
  respondentGroupOptions,
  pdkOptions,
  dimensionMappings,
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
        "📊 See overall performance",
        "📈 View performance trends",
        "⚖️ Compare performance areas",
        "💪 Strengths & areas to improve"
      ];
    }

    if (selectedRole === 'Staff') {
      return [
        "📊 See overall performance",
        "📈 View performance trends",
        "⚖️ Compare performance areas",
        "💪 Strengths & areas to improve",
        "🚀 How can we improve?",
        "🔢 How are KPIs calculated?",
        "📋 What do my scores mean?",
        "⭐ What's our best area?",
        "⚠️ What needs attention?",
        "📊 Show all dimension scores",
        "📉 How to interpret charts?",
        "💡 What actions should we take?",
        "❓ Help me understand metrics"
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
        text: "👋 Hi! I'm RehabBot.\n\nI can help you understand performance trends, strengths, and areas for improvement. What would you like to explore today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
      setShowSuggestions(true);
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
        idleVideoRefClosed.current?.play().catch(err => console.error('Error playing idle video (closed):', err));
        idleVideoRefHeader.current?.play().catch(err => console.error('Error playing idle video (header):', err));
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

  // Helper function to get lowest scoring questions
  const getLowestScoringQuestions = (count: number = 3) => {
    if (!processedDashboardData?.questionsData) return [];
    
    return [...processedDashboardData.questionsData]
      .sort((a: any, b: any) => (a.score || 0) - (b.score || 0))
      .slice(0, count)
      .map((q: any) => ({
        questionId: q.questionId,
        questionNumber: q.questionNumber,
        dimension: q.dimension || 'Unknown',
        score: q.score || 0,
      }));
  };

  // Helper function to get dimension description
  const getDimensionDescription = (dimensionName: string): string => {
    const descriptions: { [key: string]: string } = {
      'Trainee Orientation': 'how well the organization focuses on addressing individual trainee needs and ensuring successful rehabilitation outcomes',
      'Performance Orientation': 'the organization\'s commitment to service excellence and systematic performance measurement',
      'Competitor Orientation': 'how the organization responds to and learns from competitors to provide better services',
      'Long-term Focus': 'the organization\'s emphasis on long-term planning, sustainability, and continuous improvement',
      'Inter-functional Coordination': 'the quality of communication and coordination between different departments and units',
      'Employee Orientation': 'the organization\'s investment in employee development, training, and workplace satisfaction',
    };
    return descriptions[dimensionName] || 'organizational performance in this area';
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

  // Helper function to get actionable suggestions for highest dimensions (for maintaining/enhancing)
  const getHighestDimensionSuggestions = (dimensionName: string): string => {
    const suggestions: { [key: string]: string } = {
      'Trainee Orientation': 'continue prioritizing individual trainee needs, maintain regular satisfaction assessments, and keep programs tailored to unique abilities',
      'Performance Orientation': 'sustain clear performance metrics, maintain regular monitoring systems, and continue committing resources to service excellence',
      'Competitor Orientation': 'continue monitoring competitor activities, keep learning from best practices, and maintain service differentiation',
      'Long-term Focus': 'maintain strategic planning efforts, continue investing in sustainable resources, and keep emphasizing continuous improvement',
      'Inter-functional Coordination': 'sustain strong inter-departmental communication, maintain regular coordination meetings, and continue promoting collaborative practices',
      'Employee Orientation': 'continue investing in staff training programs, maintain employee motivation initiatives, and ensure adequate staffing levels are sustained',
    };
    return suggestions[dimensionName] || 'maintain current practices and continue monitoring performance';
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

  // Helper function to get role-based greeting
  const getRoleBasedGreeting = (role: UserRole): string => {
    if (!role) return "Greetings! I am RehabBot, your professional analytics advisor.\n\nPlease select your role: Staff.";
    
    switch (role) {
      case 'Staff':
        return "Greetings! I am RehabBot, your professional analytics advisor. I assist in understanding your dashboard data, KPIs, and performance metrics.\n\nI can provide insights on:\n\nOverall performance and trends\nDimension scores and comparisons\nOrganizational strengths and areas for improvement\nProfessional recommendations for enhancement\nKPI calculations and methodologies\nChart and graph interpretations\n\nHow may I assist you today?";
      default:
        return "Greetings! I am RehabBot, your professional analytics advisor.\n\nPlease select your role: Staff.";
    }
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

  // Helper function to format response based on role
  const formatResponse = (response: string): string => {
    if (selectedRole === 'Staff') {
      return formatForStaff(response);
    }
    return removeMarkdown(response);
  };

  // Role-specific response formatters
  const formatForStaff = (response: string): string => {
    return removeMarkdown(response);
  };

  // Analytics-focused bot response system
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Check if user is selecting a role (inform them to use sidebar)
    const roleSelection = isRoleSelection(userMessage);
    if (roleSelection) {
      return "Please select your role from the sidebar menu. Your role selection will customize my responses to better assist you.";
    }

    // If no role selected, remind user
    if (!selectedRole) {
      return "Please select your role from the sidebar menu: Staff.";
    }

    const dimAnalysis = getDimensionAnalysis();
    let baseResponse = '';

    // === GREETINGS ===
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/)) {
      if (selectedRole === 'Staff') {
        baseResponse = `👋 Hi! I'm RehabBot.\n\nI can help you understand performance trends, strengths, and areas for improvement. What would you like to explore today?`;
        return formatForStaff(baseResponse);
      }
    }

    // === OVERALL PERFORMANCE / KPI OVERVIEW ===
    if (message.match(/(overall|kpi|index|performance|score|how.*doing|current.*performance|see.*overall|show.*overall)/)) {
      if (!kpiData) {
        baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊\n\nMake sure your dashboard is properly loaded and data is available.";
        if (selectedRole === 'Staff') return formatForStaff(baseResponse);
        return baseResponse;
      }

      const overall = kpiData.overallIndex;
      const overallFormatted = overall.toFixed(2);
      const percentage = scoreToPercentage(overall);
      const percentageFormatted = percentage.toFixed(1);
      const rehabServEStatus = getRehabServEStatus(percentage);
      const trend = kpiData.trend;
      
      // Determine trend status and interpretation - more conversational
      let trendText: string;
      
      if (trend > 0) {
        trendText = `Great news! Performance is improving (+${trend.toFixed(2)}%). Keep up the excellent work!`;
      } else if (trend < 0) {
        trendText = `I noticed a slight drop in performance this month (${trend.toFixed(2)}%). The biggest change came from ${kpiData.lowestDimension?.name || 'various areas'}. Want me to explain further?`;
      } else {
        trendText = 'Performance is stable.';
      }
      
      baseResponse = `Here's your overall performance:\n\n📊 RehabServE Index: ${overallFormatted} (${percentageFormatted}%)\n\nStatus: ${rehabServEStatus}\n\n${trendText}`;
      if (kpiData.lowestDimension) {
        const dimPercentage = scoreToPercentage(kpiData.lowestDimension.score);
        baseResponse += `\n\nThe area needing attention is ${kpiData.lowestDimension.name} at ${dimPercentage.toFixed(1)}%.`;
      }
      baseResponse += `\n\nBased on ${kpiData.totalRespondents} responses.`;
      return formatForStaff(baseResponse);
    }

    // === TREND ANALYSIS ===
    if (message.match(/(trend|changing|improving|declining|getting better|getting worse|direction|view.*trend)/)) {
      if (!kpiData) {
        baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊\n\nMake sure your dashboard filters are set correctly and data is loaded.";
        if (selectedRole === 'Staff') return formatForStaff(baseResponse);
        return baseResponse;
      }

      const trend = kpiData.trend;
      
      if (trend > 0) {
        baseResponse = `📈 Your performance is improving! The trend shows a +${trend.toFixed(2)}% increase.\n\nKeep maintaining your current strengths while looking for new opportunities to grow.`;
        return formatForStaff(baseResponse);
      } else if (trend < 0) {
        baseResponse = `I noticed a drop in performance this period (${trend.toFixed(2)}%). Here's what I recommend:\n\n1. Check out your lowest-scoring dimension\n2. Look at specific questions that need attention\n3. Let's create an improvement plan together`;
        return formatForStaff(baseResponse);
      } else {
        baseResponse = `Performance is staying stable. That's a good foundation to build from!`;
        return formatForStaff(baseResponse);
      }
    }

    // === DIMENSION ANALYSIS ===
    if (message.match(/(dimension|dimensions|all.*scores|compare.*dimensions|which.*best|which.*worst|compare.*performance|performance.*areas|show.*dimension|all.*dimension)/)) {
      if (!dimAnalysis) {
        baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊\n\nMake sure the dashboard is loaded with dimension data.";
        return formatResponse(baseResponse);
      }

      const askingHighest = message.match(/(highest|best|top|strongest|excellent)/);
      const askingLowest = message.match(/(lowest|worst|bottom|weakest|poor)/);

      if (askingHighest && dimAnalysis.highest) {
        const dim = dimAnalysis.highest;
        const description = getDimensionDescription(dim.name);
        const suggestion = getHighestDimensionSuggestions(dim.name);
        
        baseResponse = `💪 Your strongest area is ${dim.name} (${dim.score.toFixed(2)}/7.0)\n\nThis measures ${description}\n\nThis is a real strength! To keep it strong: ${suggestion}`;
        return formatForStaff(baseResponse);
      }
      
      if (askingLowest && dimAnalysis.lowest) {
        const dim = dimAnalysis.lowest;
        const description = getDimensionDescription(dim.name);
        const suggestion = getDimensionSuggestions(dim.name);
        const lowestQuestions = getLowestScoringQuestions(3);
        
        const dimPercentage = scoreToPercentage(dim.score);
        baseResponse = `The area needing attention is ${dim.name} (${dimPercentage.toFixed(1)}%)\n\nThis measures ${description}\n\nHere's what I suggest: ${suggestion}`;
        if (lowestQuestions.length > 0) {
          baseResponse += `\n\nSpecific items to focus on:\n`;
          lowestQuestions.forEach((q, index) => {
            const questionDesc = QUESTION_DESCRIPTIONS[q.questionId] || 'N/A';
            baseResponse += `${index + 1}. ${q.questionId}: ${questionDesc}\n`;
          });
        }
        return formatForStaff(baseResponse);
      }

      // Default: show all dimensions - more conversational
      baseResponse = `Here's how all your performance areas compare:\n\n`;
      dimAnalysis.all.forEach((dim: any) => {
        const status = dim.score >= 6.0 ? '🌟 Excellent' : dim.score >= 5.0 ? '✅ Good' : '⚠️ Needs Attention';
        baseResponse += `${dim.name}: ${dim.score.toFixed(2)}/7.0 - ${status}\n`;
      });
      return formatForStaff(baseResponse);
    }

    // === STRENGTHS AND WEAKNESSES ===
    if (message.match(/(strength|weakness|strong|weak|best|worst|lowest|highest|excellent|poor|areas.*improve|what.*best|what.*worst|best.*area|what.*needs.*attention|what.*attention)/)) {
      if (!kpiData || !dimAnalysis) {
        baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊\n\nMake sure your dashboard is loaded with performance data.";
        return formatResponse(baseResponse);
      }

      const askingHighest = message.match(/(strength|strong|best|highest|excellent)/);
      const askingLowest = message.match(/(weakness|weak|worst|lowest|poor)/);

      if (askingHighest && kpiData.bestDimension) {
        const dim = kpiData.bestDimension;
        const description = getDimensionDescription(dim.name);
        const suggestion = getHighestDimensionSuggestions(dim.name);
        
        baseResponse = `💪 Your strength: ${dim.name} (${dim.score.toFixed(2)}/7.0)\n\nThis measures ${description}\n\nGreat job! To keep it strong: ${suggestion}`;
        return formatForStaff(baseResponse);
      }
      
      if (askingLowest && kpiData.lowestDimension) {
        const dim = kpiData.lowestDimension;
        const description = getDimensionDescription(dim.name);
        const suggestion = getDimensionSuggestions(dim.name);
        const lowestQuestions = getLowestScoringQuestions(3);
        
        baseResponse = `This area needs attention: ${dim.name} (${dim.score.toFixed(2)}/7.0)\n\nThis measures ${description}\n\nHere's what I suggest: ${suggestion}`;
        if (lowestQuestions.length > 0) {
          baseResponse += `\n\nSpecific items to focus on:\n`;
          lowestQuestions.forEach((q, index) => {
            const questionDesc = QUESTION_DESCRIPTIONS[q.questionId] || 'N/A';
            baseResponse += `${index + 1}. ${q.questionId}: ${questionDesc}\n`;
          });
        }
        return formatForStaff(baseResponse);
      }

      // Default fallback - show both strengths and weaknesses
      if (kpiData.bestDimension && kpiData.lowestDimension) {
        const bestDim = kpiData.bestDimension;
        const worstDim = kpiData.lowestDimension;
        baseResponse = `💪 Your strongest area: ${bestDim.name} (${bestDim.score.toFixed(2)}/7.0)\n\n⚠️ Area to improve: ${worstDim.name} (${worstDim.score.toFixed(2)}/7.0)\n\nWant me to dive deeper into either of these?`;
        return formatForStaff(baseResponse);
      }

      baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊";
      return formatResponse(baseResponse);
    }

    // === HOW KPIs ARE CALCULATED ===
    if (message.match(/(how.*calculated|how.*compute|how.*work|calculation|formula|method|explain.*kpi|how.*kpi|kpi.*calculated)/)) {
      baseResponse = `Here's how we calculate your KPIs:\n\n🔢 RehabServE Index Calculation:\n\nOverall Index: Average of all dimension scores (0-7 scale)\nPercentage: (Score / 7.0) × 100\n\nRehabServE Status:\n93-100%: Outstanding\n90-92.9%: Excellent\n85-89.9%: Very Good\n80-84.9%: Good\nBelow 80%: Needs Improvement\n\nDimensions: Average of related question scores\nQuestions: Average of responses (1-7 scale)\nTrend: % change from previous period\nResponse Rate: (Respondents / Total Invited) × 100`;
      return formatForStaff(baseResponse);
    }

    // === WHAT SCORES MEAN ===
    if (message.match(/(what.*mean|what.*score|interpret|understand|explain.*score|scale|rating|what.*scores|scores.*mean)/)) {
      const currentScore = kpiData?.overallIndex;
      const scoreText = currentScore ? currentScore.toFixed(2) : 'N/A';
      const percentage = currentScore ? scoreToPercentage(currentScore) : 0;
      const percentageText = percentage.toFixed(1);
      const rehabServEStatus = currentScore ? getRehabServEStatus(percentage) : 'N/A';
      
      baseResponse = `Here's what your scores mean:\n\n📋 RehabServE Index Guide:\n\n93-100%: 🌟 Outstanding\n90-92.9%: ⭐ Excellent\n85-89.9%: ✅ Very Good\n80-84.9%: 👍 Good\nBelow 80%: ⚠️ Needs Improvement\n\nYour current score: ${scoreText} (${percentageText}%)\n\nStatus: ${rehabServEStatus}`;
      return formatForStaff(baseResponse);
    }

    // === RECOMMENDATIONS / IMPROVEMENTS ===
    if (message.match(/(recommend|suggest|improve|better|action|what.*do|how.*improve|advice|how.*we.*improve|what.*actions|actions.*take|should.*take)/)) {
      if (!kpiData || !dimAnalysis) {
        baseResponse = "Hmm, I couldn't fetch that data right now. Want me to try again? 😊\n\nMake sure your dashboard data is loaded so I can give you recommendations.";
        return formatForStaff(baseResponse);
      }

      const lowestQuestions = getLowestScoringQuestions(3);
      
      baseResponse = `🚀 Here's how we can improve:\n\n`;
      if (kpiData.lowestDimension) {
        const dim = kpiData.lowestDimension;
        const description = getDimensionDescription(dim.name);
        const suggestion = getDimensionSuggestions(dim.name);
        const dimPercentage = scoreToPercentage(dim.score);
        baseResponse += `Let's focus on ${dim.name} (currently ${dimPercentage.toFixed(1)}%)\n\nThis measures ${description}\n\nMy recommendation: ${suggestion}`;
        if (lowestQuestions.length > 0) {
          baseResponse += `\n\nStart with these specific items:\n`;
          lowestQuestions.forEach((q, index) => {
            const questionDesc = QUESTION_DESCRIPTIONS[q.questionId] || 'N/A';
            baseResponse += `${index + 1}. ${q.questionId}: ${questionDesc}\n`;
          });
        }
      } else {
        baseResponse += `Let me check your lowest-scoring areas and I'll give you some specific recommendations.`;
      }
      return formatForStaff(baseResponse);
    }

    // === EXPLAIN GRAPHS / CHARTS ===
    if (message.match(/(graph|chart|visualization|plot|diagram|explain.*chart|what.*show|what.*mean|how.*interpret|interpret.*chart|how.*chart)/)) {
      baseResponse = `Here's how to read your charts:\n\n📉 Chart Types Explained:\n\nLine Charts: Show trends over time (line going up = improvement! 📈)\nBar Charts: Compare dimensions or questions (taller bars = higher scores)\nPie/Donut Charts: Show proportions (bigger slices = greater contribution)\nGauge Charts: Show current vs target (closer to max = better performance)\n\nRemember: Green/upward trends are good, while red/downward trends need attention!`;
      return formatForStaff(baseResponse);
    }

    // === SPECIFIC DIMENSION QUESTIONS ===
    const dimensionMatch = message.match(/(trainee orientation|performance orientation|competitor orientation|long-term focus|inter-functional coordination|employee orientation)/i);
    if (dimensionMatch) {
      const dimName = dimensionMatch[0];
      const dimData = dimAnalysis?.all.find((d: any) => 
        d.name.toLowerCase() === dimName.toLowerCase()
      );
      
      if (dimData) {
        baseResponse = `${dimData.name}: ${dimData.score.toFixed(2)} / 7.0\n\nStatus: ${dimData.score >= 6.0 ? 'Excellent' : dimData.score >= 5.0 ? 'Good' : dimData.score >= 4.0 ? 'Needs Improvement' : 'Requires Attention'}\n\n${dimData.score < 5.0 ? 'Consider improvement initiatives.' : 'Maintain current practices.'}`;
        return formatForStaff(baseResponse);
      }
    }

    // === QUESTION ID QUERIES (TO1, TO2, PO1, etc.) ===
    const questionIdMatch = message.match(/\b(TO|PO|CO|LO|IO|EO)(\d+)\b/i);
    if (questionIdMatch) {
      const questionId = questionIdMatch[0].toUpperCase();
      const description = QUESTION_DESCRIPTIONS[questionId];
      const dimension = QUESTION_TO_DIMENSION[questionId];
      
      if (description) {
        const questionData = processedDashboardData?.questionsData?.find((q: any) => 
          q.questionId === questionId
        );
        
        baseResponse = `${questionId}\n\n${description}\n\nDimension: ${dimension || 'Unknown'}`;
        if (questionData) {
          baseResponse += `\n\nScore: ${questionData.score?.toFixed(2) || 'N/A'} / 7.0`;
          const score = questionData.score || 0;
          if (score >= 6.0) {
            baseResponse += ` (Excellent)`;
          } else if (score >= 5.0) {
            baseResponse += ` (Good - room for improvement)`;
          } else if (score >= 4.0) {
            baseResponse += ` (Average - needs attention)`;
          } else {
            baseResponse += ` (Low - requires improvement)`;
          }
        } else {
          baseResponse += `\n\nScore data not available.`;
        }
        return formatForStaff(baseResponse);
      } else {
        baseResponse = `Question ID ${questionId} not found. Valid question IDs are:\n\nTO1-TO6 (Trainee Orientation)\nPO1-PO6 (Performance Orientation)\nCO1-CO6 (Competitor Orientation)\nLO1-LO8 (Long-term Focus)\nIO1-IO6 (Inter-functional Coordination)\nEO1-EO6 (Employee Orientation)`;
        return formatResponse(baseResponse);
      }
    }

    // === PARTICIPATION / RESPONDENTS ===
    if (message.match(/(participation|respondents|how many|sample size)/)) {
      if (!kpiData) {
        baseResponse = "Respondent data is not available.";
        return formatForStaff(baseResponse);
      }

      baseResponse = `Total Respondents: ${kpiData.totalRespondents}\n\nTotal survey responses for current filter settings.`;
      return formatForStaff(baseResponse);
    }

    // === PDK-SPECIFIC QUERIES ===
    if (message.match(/(pdk|center|centre)/)) {
      if (kpiData && kpiData.lowestDimension) {
        const dim = kpiData.lowestDimension;
        const description = getDimensionDescription(dim.name);
        const suggestion = getDimensionSuggestions(dim.name);
        const lowestQuestions = getLowestScoringQuestions(3);
        
        const overallPercentage = scoreToPercentage(kpiData.overallIndex);
        const overallStatus = getRehabServEStatus(overallPercentage);
        const dimPercentage = scoreToPercentage(dim.score);
        
        baseResponse = `Performance Report\n\nRehabServE Index: ${kpiData.overallIndex.toFixed(2)} (${overallPercentage.toFixed(1)}%)\n\nStatus: ${overallStatus}\n\nFocus area is ${dim.name}, with a score of ${dim.score.toFixed(2)} (${dimPercentage.toFixed(1)}%)\n\nMeasures: ${description}\n\nAction: ${suggestion}`;
        if (lowestQuestions.length > 0) {
          baseResponse += `\n\nLowest-scoring items:\n`;
          lowestQuestions.forEach((q, index) => {
            const questionDesc = QUESTION_DESCRIPTIONS[q.questionId] || 'N/A';
            const qPercentage = scoreToPercentage(q.score);
            baseResponse += `${index + 1}. ${q.questionId} (${q.score.toFixed(2)}, ${qPercentage.toFixed(1)}%): ${questionDesc}\n`;
          });
        }
        return formatForStaff(baseResponse);
      }
      
      if (kpiData) {
        const overallPercentage = scoreToPercentage(kpiData.overallIndex);
        const overallStatus = getRehabServEStatus(overallPercentage);
      
        baseResponse = `Performance Overview\n\nRehabServE Index: ${kpiData.overallIndex.toFixed(2)} / 7.0 (${overallPercentage.toFixed(1)}%)\n\nStatus: ${overallStatus}\n\nNeed specific recommendations?`;
        return formatForStaff(baseResponse);
      } else {
        baseResponse = `Performance Overview\n\nOverall: N/A\n\nNeed specific recommendations?`;
        return formatForStaff(baseResponse);
      }
    }

    // === HELP / GENERAL ===
    if (message.match(/(help|what.*can|what.*do|capabilities|assist|understand.*metric|help.*understand|explain.*metric)/)) {
      baseResponse = `I'm here to help! I can assist with:\n\n📊 Performance overview\n📈 Trends analysis\n⚖️ Dimension comparisons\n💪 Strengths & areas to improve\n🚀 Improvement recommendations\n📋 Score interpretation\n🔢 KPI calculations\n📉 Chart explanations\n\nWhat would you like to explore?`;
      return formatForStaff(baseResponse);
    }

    // === DEFAULT RESPONSE ===
    baseResponse = `I'm here to help! I can assist with:\n\n📊 Performance metrics\n📈 Trends analysis\n⚖️ Dimension comparisons\n💪 Strengths & weaknesses\n🚀 Improvement recommendations\n\nTry asking about a specific metric, or use the buttons below to get started!`;
    return formatForStaff(baseResponse);
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
  const getAvatarImagePath = () => {
    switch (avatarState) {
      case 'idle':
        return '/RehabBotIdle.png';
      case 'listening':
        return '/RehabBotListening.png';
      case 'talking':
        return '/RehabBotSpeaking.png';
      case 'success':
        return '/RehabBotIdle.png'; // Use idle image for success state
      default:
        return '/RehabBotIdle.png';
    }
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
                      src="/RehabBotSpeaking4.mp4"
                      loop
                      muted
                      playsInline
                  className="w-[140px] h-[140px] rounded-full object-cover bg-transparent"
                      style={{ border: 'none', outline: 'none' }}
                    />
                  ) : avatarState === 'idle' ? (
                    <video 
                      ref={idleVideoRefClosed}
                      id="hornbillAvatar"
                      src="/RehabBotIdle.mp4"
                      loop
                      muted
                      playsInline
                      autoPlay
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
                    src="/RehabBotSpeaking4.mp4"
                    loop
                    muted
                    playsInline
                 className="w-[120px] h-[120px] rounded-full object-cover bg-transparent"
                    style={{ border: 'none', outline: 'none' }}
                  />
                ) : avatarState === 'idle' ? (
                  <video 
                    ref={idleVideoRefHeader}
                    id="hornbillAvatarHeader"
                    src="/RehabBotIdle2.mp4"
                    loop
                    muted
                    playsInline
                    autoPlay
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

