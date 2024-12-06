import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLoading,
  IonAlert,
  IonChip,
  IonText,
  IonModal
} from '@ionic/react';
import { 
  sendOutline, 
  chatbubbleOutline, 
  refreshOutline,
  personOutline
} from 'ionicons/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Import profile utilities
import { getUserProfile } from '../utils/profileUtils';

// Interfaces for chat functionality
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface UserProfile {
  userId?: string;
  name?: string;
  age?: number;
  gender?: string;
  medicalHistory?: string[];
  glucoseLevel?: string;
}

interface ChatResponse {
  response: {
    message: string;
    suggestions: string[];
    timestamp: string;
  };
}

const ChatScreen: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Local storage keys
  const MESSAGES_KEY = 'diabeyes_chat_messages';

  // Initialize user profile and messages on component mount
  useEffect(() => {
    // Retrieve user profile from local storage
    const profile = getUserProfile();
    
    if (profile) {
      setUserProfile({
        userId: profile.id || uuidv4(),
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        medicalHistory: profile.medicalHistory,
        glucoseLevel: profile.glucoseLevel
      });
    } else {
      // Create a default profile if none exists
      const defaultProfile: UserProfile = {
        userId: uuidv4(),
        name: 'User',
        age: 25,
        gender: 'female',
        medicalHistory: ['diabetes'],
        glucoseLevel: '120'
      };
      setUserProfile(defaultProfile);
    }

    // Load previous messages
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message to API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Update messages and local storage
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));

    // Clear input
    setInputMessage('');

    try {
      setLoading(true);

      // Prepare context for API call
      const requestPayload = {
        message: inputMessage,
        userId: userProfile.userId,
        context: {
          previousMessages: messages.slice(-5).map(msg => ({
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp
          })),
          userProfile: {
            age: userProfile.age,
            gender: userProfile.gender,
            medicalHistory: userProfile.medicalHistory,
            glucoseLevel: userProfile.glucoseLevel
          }
        }
      };

      // Send message to API
      const response = await axios.post<ChatResponse>(
        'https://diabeyes-server.vercel.app/api/chat', 
        requestPayload
      );

      // Create bot message
      const botMessage: Message = {
        id: uuidv4(),
        text: response.data.response.message,
        sender: 'bot',
        timestamp: response.data.response.timestamp
      };

      // Update messages and local storage
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(finalMessages));

      // Show suggestions if available
      if (response.data.response.suggestions && response.data.response.suggestions.length > 0) {
        setCurrentSuggestions(response.data.response.suggestions);
        setShowSuggestionsModal(true);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(MESSAGES_KEY);
  };

  // Use suggestion
  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestionsModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>DiabEyes Chat</IonTitle>
          <IonButton 
            slot="start" 
            fill="clear"
          >
            <IonIcon icon={personOutline} />
            <IonLabel>{userProfile.name || 'User'}</IonLabel>
          </IonButton>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={clearChat}
          >
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {/* Chat Messages */}
        <IonList>
          {messages.map((message) => (
            <IonItem 
              key={message.id} 
              lines="none"
              className={`message ${message.sender}`}
            >
              <IonCard 
                className={`message-card ${message.sender}`}
                style={{ 
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.sender === 'user' ? '#e6f2ff' : '#f0f0f0'
                }}
              >
                <IonCardContent>
                  <IonText>{message.text}</IonText>
                </IonCardContent>
              </IonCard>
            </IonItem>
          ))}
          <div ref={messagesEndRef} />
        </IonList>

        {/* Input Area */}
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          padding: '10px', 
          backgroundColor: 'white' 
        }}>
          <IonInput
            value={inputMessage}
            placeholder="Type your message..."
            onIonChange={e => setInputMessage(e.detail.value!)}
            style={{ border: '1px solid #ccc', borderRadius: '20px', padding: '0 10px' }}
          />
          <IonButton 
            expand="block" 
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
          >
            <IonIcon icon={sendOutline} slot="start" />
            Send
          </IonButton>
        </div>

        {/* Suggestions Modal */}
        <IonModal 
          isOpen={showSuggestionsModal}
          onDidDismiss={() => setShowSuggestionsModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Suggestions</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {currentSuggestions.map((suggestion, index) => (
              <IonItem 
                key={index} 
                button 
                onClick={() => useSuggestion(suggestion)}
              >
                <IonLabel>{suggestion}</IonLabel>
              </IonItem>
            ))}
          </IonContent>
        </IonModal>
      </IonContent>

      {/* Loading Indicator */}
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Sending message...'}
      />

      {/* Error Alert */}
      <IonAlert
        isOpen={!!error}
        onDidDismiss={() => setError(null)}
        header={'Error'}
        message={error}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default ChatScreen;
