import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonImg,
  IonLoading,
  IonAlert,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonText,
  IonChip
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Client } from '@gradio/client';
import { alertCircleOutline, checkmarkCircleOutline, analyticsOutline } from 'ionicons/icons';

interface Prediction {
  label: string;
  confidence: number;
}

interface APIResponse {
  confidences: Prediction[];
  label: string;
}

interface AnalysisResult {
  predictions: Prediction[];
  highestConfidence: {
    label: string;
    confidence: number;
  };
  timestamp: string;
}

const CameraScreen: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const getStatusColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'severe': return 'danger';
      case 'moderate': return 'warning';
      case 'mild': return 'success';
      case 'no dr': return 'success';
      case 'proliferate dr': return 'danger';
      default: return 'medium';
    }
  };

  const getRecommendations = (label: string): string[] => {
    switch (label.toLowerCase()) {
      case 'severe':
        return [
          'Seek immediate medical attention',
          'Schedule an urgent appointment with an ophthalmologist',
          'Avoid strenuous activities',
          'Keep blood sugar levels under strict control'
        ];
      case 'moderate':
        return [
          'Schedule an appointment with your eye doctor',
          'Monitor blood sugar levels closely',
          'Follow prescribed medication schedule',
          'Report any vision changes to your doctor'
        ];
      case 'mild':
        return [
          'Regular monitoring of blood sugar levels',
          'Maintain healthy diet and exercise routine',
          'Schedule regular eye check-ups',
          'Report any vision changes to your doctor'
        ];
      case 'no dr':
        return [
          'Continue regular eye check-ups',
          'Maintain healthy lifestyle habits',
          'Monitor blood sugar levels',
          'Follow preventive care guidelines'
        ];
      case 'proliferate dr':
        return [
          'Urgent medical attention required',
          'Immediate consultation with retina specialist',
          'Strict blood sugar control',
          'Avoid heavy lifting and strenuous activities'
        ];
      default:
        return [
          'Consult with your healthcare provider',
          'Monitor your symptoms',
          'Maintain regular check-ups',
          'Follow your treatment plan'
        ];
    }
  };

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (image.base64String) {
        setPhoto(`data:image/jpeg;base64,${image.base64String}`);
        analyzeImage(image.base64String);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setAlertMessage('Failed to take photo. Please try again.');
      setShowAlert(true);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setApiError(null);
    
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

      // Connect to Gradio client
      const client = await Client.connect("sartizAyon/iubat");
      
      // Make prediction
      const result = await client.predict("/predict", { 
        image: imageBlob,
      });

      console.log('API Response:', result.data);

      // Process the API response
      const apiResponse = result.data[0] as APIResponse;
      
      // Find prediction with highest confidence
      const highestConfidence = apiResponse.confidences.reduce((prev, current) => 
        (current.confidence > prev.confidence) ? current : prev
      );

      const analysisResult: AnalysisResult = {
        predictions: apiResponse.confidences,
        highestConfidence: {
          label: highestConfidence.label,
          confidence: highestConfidence.confidence
        },
        timestamp: new Date().toISOString()
      };

      setAnalysisResult(analysisResult);
      
      // Save to localStorage
      localStorage.setItem('lastAnalysis', JSON.stringify(analysisResult));
      
      setShowModal(true);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setApiError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        const request = await Camera.requestPermissions();
        if (request.camera !== 'granted') {
          setAlertMessage('Camera permission is required to use this feature.');
          setShowAlert(true);
        }
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Eye Analysis</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div className="ion-text-center">
          {photo && (
            <IonImg 
              src={photo} 
              alt="Captured eye" 
              style={{ maxHeight: '300px', margin: '20px auto' }}
            />
          )}
          
          <IonButton 
            expand="block"
            onClick={takePicture}
            disabled={loading}
          >
            {loading ? <IonSpinner name="crescent" /> : 'Take Photo'}
          </IonButton>
        </div>

        <IonLoading
          isOpen={loading}
          message="Analyzing image..."
          spinner="crescent"
        />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Alert"
          message={alertMessage}
          buttons={['OK']}
        />

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding">
            {apiError ? (
              <div className="ion-text-center ion-padding">
                <IonIcon
                  icon={alertCircleOutline}
                  color="danger"
                  style={{ fontSize: '48px' }}
                />
                <IonText color="danger">
                  <p>{apiError}</p>
                </IonText>
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </div>
            ) : analysisResult && (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center">
                    Analysis Results
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="ion-text-center">
                    <IonIcon
                      icon={checkmarkCircleOutline}
                      color={getStatusColor(analysisResult.highestConfidence.label)}
                      style={{ fontSize: '48px' }}
                    />
                  </div>
                  
                  <div className="ion-text-center ion-margin-vertical">
                    <h2>
                      <IonText color={getStatusColor(analysisResult.highestConfidence.label)}>
                        {analysisResult.highestConfidence.label}
                      </IonText>
                    </h2>
                    <p>Confidence: {(analysisResult.highestConfidence.confidence * 100).toFixed(1)}%</p>
                  </div>

                  <div className="ion-margin-top">
                    <h3>
                      <IonIcon icon={analyticsOutline} /> Other Possibilities:
                    </h3>
                    <div className="ion-padding-vertical">
                      {analysisResult.predictions
                        .filter(pred => pred.label !== analysisResult.highestConfidence.label)
                        .map((pred, index) => (
                          <IonChip 
                            key={index}
                            color={getStatusColor(pred.label)}
                          >
                            {pred.label}: {(pred.confidence * 100).toFixed(1)}%
                          </IonChip>
                        ))}
                    </div>
                  </div>

                  <div className="ion-margin-top">
                    <h3>Recommendations:</h3>
                    <ul>
                      {getRecommendations(analysisResult.highestConfidence.label).map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="ion-text-center ion-margin-top">
                    <small>
                      Analyzed at: {new Date(analysisResult.timestamp).toLocaleString()}
                    </small>
                  </p>

                  <div className="ion-text-center ion-margin-top">
                    <IonButton onClick={() => setShowModal(false)}>
                      Close
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CameraScreen;
