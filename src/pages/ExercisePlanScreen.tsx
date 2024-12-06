import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButton,
  IonAlert,
  IonModal,
  IonHeader as ModalHeader,
  IonToolbar as ModalToolbar,
  IonButtons,
  IonContent as ModalContent
} from '@ionic/react';

interface Exercise {
  name: string;
  duration: string;
  intensity: 'Low' | 'Moderate' | 'High';
  description: string;
}

const ExercisePlanScreen: React.FC = () => {
  const [exercisePlan, setExercisePlan] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateExercisePlan = (glucoseLevel: number = 120) => {
    let plan: Exercise[] = [];

    if (glucoseLevel < 100) {
      // Low glucose level: Focus on energy-boosting, low-intensity exercises
      plan = [
        { 
          name: 'Walking', 
          duration: '30 mins', 
          intensity: 'Low',
          description: 'Gentle walking to improve circulation and maintain stable glucose levels.'
        },
        { 
          name: 'Light Yoga', 
          duration: '20 mins', 
          intensity: 'Low',
          description: 'Gentle stretching and breathing exercises to reduce stress and improve insulin sensitivity.'
        }
      ];
    } else if (glucoseLevel < 125) {
      // Prediabetes: Moderate intensity exercises
      plan = [
        { 
          name: 'Brisk Walking', 
          duration: '45 mins', 
          intensity: 'Moderate',
          description: 'Faster-paced walking to improve cardiovascular health and glucose metabolism.'
        },
        { 
          name: 'Cycling', 
          duration: '30 mins', 
          intensity: 'Moderate',
          description: 'Low-impact cardio to help manage blood sugar levels.'
        },
        { 
          name: 'Resistance Training', 
          duration: '20 mins', 
          intensity: 'Moderate',
          description: 'Light weight training to build muscle and improve insulin sensitivity.'
        }
      ];
    } else {
      // High glucose level: Focus on high-intensity, fat-burning exercises
      plan = [
        { 
          name: 'High-Intensity Interval Training (HIIT)', 
          duration: '25 mins', 
          intensity: 'High',
          description: 'Short bursts of intense exercise to rapidly improve glucose metabolism.'
        },
        { 
          name: 'Swimming', 
          duration: '40 mins', 
          intensity: 'High',
          description: 'Full-body workout that helps lower blood sugar and improve cardiovascular health.'
        },
        { 
          name: 'Circuit Training', 
          duration: '30 mins', 
          intensity: 'High',
          description: 'Combination of cardio and strength training to boost metabolism and glucose control.'
        }
      ];
    }

    setExercisePlan(plan);
  };

  useEffect(() => {
    try {
      // In a real app, this would be based on the latest glucose reading
      generateExercisePlan();
    } catch (err) {
      setError('Failed to generate exercise plan. Please try again.');
    }
  }, []);

  const regeneratePlan = () => {
    try {
      // Simulate regenerating plan with a random glucose level
      const randomGlucoseLevel = Math.random() * 200;
      generateExercisePlan(randomGlucoseLevel);
      setError(null);
    } catch (err) {
      setError('Failed to regenerate exercise plan. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Personalized Exercise Plan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && (
          <IonAlert
            isOpen={!!error}
            onDidDismiss={() => setError(null)}
            header={'Error'}
            message={error}
            buttons={['OK']}
          />
        )}

        <IonButton onClick={regeneratePlan} expand="block">
          Regenerate Plan
        </IonButton>

        <IonList>
          {exercisePlan.map((exercise, index) => (
            <IonItem 
              key={index} 
              button 
              onClick={() => setSelectedExercise(exercise)}
            >
              <IonLabel>
                <h2>{exercise.name}</h2>
                <p>Duration: {exercise.duration}</p>
              </IonLabel>
              <IonNote slot="end" color="primary">
                {exercise.intensity}
              </IonNote>
            </IonItem>
          ))}
        </IonList>

        <IonModal 
          isOpen={!!selectedExercise} 
          onDidDismiss={() => setSelectedExercise(null)}
        >
          {selectedExercise && (
            <>
              <ModalHeader>
                <ModalToolbar>
                  <IonTitle>{selectedExercise.name}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={() => setSelectedExercise(null)}>Close</IonButton>
                  </IonButtons>
                </ModalToolbar>
              </ModalHeader>
              <ModalContent>
                <div className="ion-padding">
                  <p><strong>Duration:</strong> {selectedExercise.duration}</p>
                  <p><strong>Intensity:</strong> {selectedExercise.intensity}</p>
                  <p>{selectedExercise.description}</p>
                </div>
              </ModalContent>
            </>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ExercisePlanScreen;
