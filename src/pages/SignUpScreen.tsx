import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignUpScreen.css';

const SignUpScreen: React.FC = () => {
  const history = useHistory();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      history.push('/camera');
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  };

  return (
    <IonPage>
      <IonContent className="signup-content">
        <div className="signup-container">
          <h1>Welcome to Glucose Monitor</h1>
          <p>Sign in to continue</p>
          <button onClick={handleGoogleSignIn} className="google-signin-button">
            Sign in with Google
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUpScreen;