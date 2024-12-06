import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonFooter,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    // Load messages from localStorage when component mounts
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    // Scroll to bottom when messages update
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(500);
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate API call (replace this with actual API call later)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response (replace with actual API response)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getMockResponse(newMessage),
        sender: 'bot',
        timestamp: formatTimestamp()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockResponse = (userInput: string): string => {
    // Mock responses based on user input
    const input = userInput.toLowerCase();
    if (input.includes('sad') || input.includes('depressed')) {
      return "I'm sorry you're feeling down. Remember that it's okay to not be okay. Would you like to try some mood-lifting exercises?";
    } else if (input.includes('happy') || input.includes('good')) {
      return "I'm glad you're feeling good! Would you like some suggestions to maintain this positive mood?";
    } else if (input.includes('anxious') || input.includes('worried')) {
      return "I understand anxiety can be challenging. Let's try some deep breathing exercises together.";
    }
    return "Thank you for sharing. How else can I help you today?";
  };

  const formatMessageDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today ' + messageDate.toLocaleTimeString();
    }
    return messageDate.toLocaleString();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat with AI</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent ref={contentRef} className="ion-padding">
        <IonList>
          {messages.map((message, index) => (
            <IonCard key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              style={{
                maxWidth: '80%',
                marginLeft: message.sender === 'user' ? 'auto' : '10px',
                marginRight: message.sender === 'bot' ? 'auto' : '10px'
              }}>
              <IonCardContent>
                <div style={{ marginBottom: '8px' }}>{message.text}</div>
                <div style={{ 
                  fontSize: '0.8em', 
                  color: '#666',
                  textAlign: 'right' 
                }}>
                  {formatMessageDate(message.timestamp)}
                </div>
              </IonCardContent>
            </IonCard>
          ))}
          {isLoading && (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="dots" />
            </div>
          )}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonItem>
            <IonInput
              placeholder="How are you feeling today?"
              value={newMessage}
              onIonChange={e => setNewMessage(e.detail.value || '')}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <IonButton slot="end" onClick={handleSend}>
              Send
            </IonButton>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatScreen;
