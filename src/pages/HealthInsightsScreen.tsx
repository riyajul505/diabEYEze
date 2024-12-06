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
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonBadge,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import { 
  refreshOutline, 
  medkitOutline, 
  heartOutline, 
  eyeOutline, 
  alertCircleOutline 
} from 'ionicons/icons';

// Utility function to generate random numbers
const getRandomNumber = (min: number, max: number, decimalPlaces: number = 0): number => {
  const randomNum = Math.random() * (max - min) + min;
  return Number(randomNum.toFixed(decimalPlaces));
};

// Health metrics generation function
const generateHealthMetrics = () => {
  return {
    glucoseLevel: getRandomNumber(70, 400, 1), // mg/dL
    diabeticNephropathy: "No",
    intraocularPressure: getRandomNumber(10, 30, 1) // mmHg
  };
};

// Function to categorize glucose levels
const getGlucoseLevelCategory = (level: number) => {
  if (level < 70) return { status: 'Low', color: 'danger' };
  if (level < 100) return { status: 'Normal', color: 'success' };
  if (level < 126) return { status: 'Prediabetes', color: 'warning' };
  if (level < 200) return { status: 'High', color: 'danger' };
  return { status: 'Very High', color: 'danger' };
};

// Function to get recommendations based on glucose level
const getGlucoseRecommendations = (level: number): string[] => {
  const { status } = getGlucoseLevelCategory(level);
  
  switch (status) {
    case 'Low':
      return [
        'Consume fast-acting carbohydrates',
        'Monitor blood sugar frequently',
        'Have a balanced meal soon',
        'Consult healthcare provider if symptoms persist'
      ];
    case 'Prediabetes':
      return [
        'Consult with a healthcare professional',
        'Improve diet and exercise habits',
        'Regular blood sugar monitoring',
        'Consider lifestyle modifications'
      ];
    case 'High':
      return [
        'Consult your doctor immediately',
        'Follow prescribed medication',
        'Maintain a strict diet',
        'Increase physical activity',
        'Monitor blood sugar levels closely'
      ];
    case 'Very High':
      return [
        'Seek immediate medical attention',
        'Follow emergency diabetes management plan',
        'Strict blood sugar control',
        'Avoid strenuous activities',
        'Hydrate and monitor for ketones'
      ];
    default:
      return [
        'Maintain current healthy lifestyle',
        'Regular exercise',
        'Balanced diet',
        'Routine health check-ups'
      ];
  }
};

const HealthInsightsScreen: React.FC = () => {
  const [healthMetrics, setHealthMetrics] = useState(generateHealthMetrics());
  const [loading, setLoading] = useState(false);

  const refreshHealthMetrics = (event?: CustomEvent<RefresherEventDetail>) => {
    setLoading(true);
    
    // Simulate async operation
    setTimeout(() => {
      const newMetrics = generateHealthMetrics();
      setHealthMetrics(newMetrics);
      setLoading(false);
      
      // Complete the refresher if it was triggered by pull-to-refresh
      if (event) {
        event.detail.complete();
      }
    }, 1000);
  };

  useEffect(() => {
    // Initial load from localStorage or generate new metrics
    const storedMetrics = localStorage.getItem('healthMetrics');
    if (storedMetrics) {
      setHealthMetrics(JSON.parse(storedMetrics));
    }
  }, []);

  useEffect(() => {
    // Save metrics to localStorage whenever they change
    localStorage.setItem('healthMetrics', JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  const { status, color } = getGlucoseLevelCategory(healthMetrics.glucoseLevel);
  const recommendations = getGlucoseRecommendations(healthMetrics.glucoseLevel);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Health Insights</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={() => refreshHealthMetrics()}
            disabled={loading}
          >
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refreshHealthMetrics}>
          <IonRefresherContent />
        </IonRefresher>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={heartOutline} /> Glucose Level
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="ion-text-center">
                    <h2>
                      <IonText color={color}>
                        {healthMetrics.glucoseLevel} mg/dL
                      </IonText>
                    </h2>
                    <IonBadge color={color}>{status}</IonBadge>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={eyeOutline} /> Intraocular Pressure
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="ion-text-center">
                    <h2>{healthMetrics.intraocularPressure} mmHg</h2>
                    <IonBadge color={
                      healthMetrics.intraocularPressure < 12 ? 'success' :
                      healthMetrics.intraocularPressure > 22 ? 'danger' : 'warning'
                    }>
                      {healthMetrics.intraocularPressure < 12 ? 'Low' :
                       healthMetrics.intraocularPressure > 22 ? 'High' : 'Normal'}
                    </IonBadge>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={medkitOutline} /> Diabetic Nephropathy
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="ion-text-center">
                    <h2>
                      <IonText color={healthMetrics.diabeticNephropathy === 'No' ? 'success' : 'danger'}>
                        {healthMetrics.diabeticNephropathy}
                      </IonText>
                    </h2>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={alertCircleOutline} /> Recommendations
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <ul>
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HealthInsightsScreen;
