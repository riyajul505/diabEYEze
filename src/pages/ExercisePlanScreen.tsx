import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLoading,
  IonAlert,
  IonInput,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import axios from 'axios';
import { getUserProfile } from '../utils/profileUtils';

// Interfaces for exercise suggestions
interface ExerciseSuggestion {
  name: string;
  caloriesBurned: number;
  duration: number;
}

interface ExerciseSuggestionsResponse {
  suggestedExercises: ExerciseSuggestion[];
}

const ExercisePlanScreen: React.FC = () => {
  // State management
  const [exerciseType, setExerciseType] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState<string>('');
  const [suggestedExercises, setSuggestedExercises] = useState<ExerciseSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exercise type options
  const exerciseTypes = [
    'cardio', 
    'strength', 
    'flexibility', 
    'balance', 
    'high-intensity'
  ];

  // Fetch exercise suggestions
  const fetchExerciseSuggestions = async () => {
    // Validate inputs
    if (!exerciseType || !sessionDuration) {
      setError('Please select exercise type and session duration');
      return;
    }

    try {
      setLoading(true);

      // Get user profile from local storage
      const userProfile = getUserProfile();

      // Prepare request payload
      const requestPayload = {
        Name: userProfile?.name || 'User',
        Age: userProfile?.age || 30,
        weight: userProfile?.weight || 70,
        exercisesType: exerciseType,
        sessionDuration: sessionDuration
      };

      // Send request to API
      const response = await axios.post<ExerciseSuggestionsResponse>(
        'https://diabeyes-server.vercel.app/api/exercise-suggestions',
        requestPayload
      );

      // Update suggested exercises
      setSuggestedExercises(response.data.suggestedExercises);
    } catch (err) {
      console.error('Error fetching exercise suggestions:', err);
      setError('Failed to fetch exercise suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Exercise Planner</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Exercise Type</IonLabel>
                <IonSelect 
                  value={exerciseType}
                  placeholder="Select Exercise Type"
                  onIonChange={e => setExerciseType(e.detail.value)}
                >
                  {exerciseTypes.map(type => (
                    <IonSelectOption key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Session Duration (minutes)</IonLabel>
                <IonInput
                  type="number"
                  value={sessionDuration}
                  placeholder="Enter duration"
                  onIonChange={e => setSessionDuration(e.detail.value!)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton 
                expand="block" 
                onClick={fetchExerciseSuggestions}
                disabled={!exerciseType || !sessionDuration}
              >
                Get Exercise Suggestions
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Suggested Exercises */}
          {suggestedExercises.length > 0 && (
            <IonRow>
              <IonCol>
                <h2>Suggested Exercises</h2>
                {suggestedExercises.map((exercise, index) => (
                  <IonCard key={index}>
                    <IonCardHeader>
                      <IonCardTitle>{exercise.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>Duration: {exercise.duration} minutes</p>
                      <p>Calories Burned: {exercise.caloriesBurned} cal</p>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonCol>
            </IonRow>
          )}
        </IonGrid>

        {/* Loading Indicator */}
        <IonLoading
          isOpen={loading}
          onDidDismiss={() => setLoading(false)}
          message={'Fetching exercise suggestions...'}
        />

        {/* Error Alert */}
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={'Error'}
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ExercisePlanScreen;
