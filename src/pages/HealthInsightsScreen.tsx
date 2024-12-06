import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAlert
} from '@ionic/react';

interface HealthInsight {
  glucoseLevel: number | null;
  status: 'Normal' | 'Prediabetes' | 'High Risk';
  recommendation: string;
}

const HealthInsightsScreen: React.FC = () => {
  const [healthInsight, setHealthInsight] = useState<HealthInsight>({
    glucoseLevel: null,
    status: 'Normal',
    recommendation: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching health data
    const fetchHealthData = () => {
      // In a real app, this would come from an AI analysis of the eye image
      const mockGlucoseLevel = Math.random() * 200;
      let status: HealthInsight['status'] = 'Normal';
      let recommendation = '';

      if (mockGlucoseLevel < 100) {
        status = 'Normal';
        recommendation = 'Your glucose levels are within the healthy range. Continue maintaining a balanced diet and regular exercise.';
      } else if (mockGlucoseLevel < 125) {
        status = 'Prediabetes';
        recommendation = 'Your glucose levels indicate prediabetes. Consider consulting a healthcare professional and making lifestyle changes.';
      } else {
        status = 'High Risk';
        recommendation = 'Your glucose levels are high. Immediate medical consultation is recommended.';
      }

      setHealthInsight({
        glucoseLevel: Number(mockGlucoseLevel.toFixed(2)),
        status,
        recommendation
      });
    };

    fetchHealthData();
  }, []);

  const regenerateInsight = () => {
    try {
      // Simulate re-analyzing or fetching new data
      const mockGlucoseLevel = Math.random() * 200;
      let status: HealthInsight['status'] = 'Normal';
      let recommendation = '';

      if (mockGlucoseLevel < 100) {
        status = 'Normal';
        recommendation = 'Your glucose levels are within the healthy range. Continue maintaining a balanced diet and regular exercise.';
      } else if (mockGlucoseLevel < 125) {
        status = 'Prediabetes';
        recommendation = 'Your glucose levels indicate prediabetes. Consider consulting a healthcare professional and making lifestyle changes.';
      } else {
        status = 'High Risk';
        recommendation = 'Your glucose levels are high. Immediate medical consultation is recommended.';
      }

      setHealthInsight({
        glucoseLevel: Number(mockGlucoseLevel.toFixed(2)),
        status,
        recommendation
      });
      setError(null);
    } catch (err) {
      setError('Failed to regenerate health insights. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Health Insights</IonTitle>
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

        {healthInsight.glucoseLevel !== null ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Glucose Analysis</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Estimated Glucose Level: {healthInsight.glucoseLevel} mg/dL</p>
              <p>Status: {healthInsight.status}</p>
              <p>{healthInsight.recommendation}</p>
            </IonCardContent>
            <div className="ion-padding">
              <IonButton onClick={regenerateInsight}>
                Regenerate Insights
              </IonButton>
            </div>
          </IonCard>
        ) : (
          <p>Analyzing health data...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HealthInsightsScreen;
