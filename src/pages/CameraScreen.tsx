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
  IonIcon,
  IonText,
} from '@ionic/react';
import { camera, analytics } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './CameraScreen.css';

const CameraScreen: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        const request = await Camera.requestPermissions();
        if (request.camera !== 'granted') {
          setError('Camera permission is required to take photos.');
        }
      }
    } catch (err) {
      console.error('Permission check failed:', err);
      setError('Failed to initialize camera. Please check permissions.');
    }
  };

  const takePicture = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        presentationStyle: 'popover',
        promptLabelHeader: 'Take Eye Photo',
        promptLabelPhoto: 'Take Photo',
        promptLabelPicture: 'Use Camera'
      });

      if (image?.dataUrl) {
        setPhoto(image.dataUrl);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      // Don't show error for user cancellation
      if (!err.message?.includes('cancelled') && !err.message?.includes('canceled')) {
        setError(err.message || 'Failed to take photo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!photo) return;

    try {
      setLoading(true);
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      const mockResult = {
        glucoseLevel: Math.floor(Math.random() * (180 - 70) + 70),
        confidence: Math.floor(Math.random() * (100 - 80) + 80)
      };
      
      setError(undefined);
      alert(`Glucose Level: ${mockResult.glucoseLevel} mg/dL\nConfidence: ${mockResult.confidence}%`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Eye Glucose Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="camera-content ion-padding">
        <div className="camera-container">
          {!photo ? (
            <div className="camera-placeholder">
              <IonIcon icon={camera} className="camera-icon" />
              <IonText color="medium">
                <p>Take a clear photo of your eye</p>
              </IonText>
            </div>
          ) : (
            <div className="photo-preview">
              <IonImg src={photo} alt="Eye scan" />
            </div>
          )}

          <div className="button-container">
            <IonButton 
              expand="block"
              onClick={takePicture}
              className="capture-button"
            >
              <IonIcon slot="start" icon={camera} />
              {photo ? 'Retake Photo' : 'Take Photo'}
            </IonButton>

            {photo && (
              <IonButton 
                expand="block"
                color="secondary"
                onClick={analyzeImage}
                className="analyze-button"
              >
                <IonIcon slot="start" icon={analytics} />
                Analyze Image
              </IonButton>
            )}
          </div>
        </div>

        <IonLoading 
          isOpen={loading}
          message={photo ? 'Analyzing image...' : 'Opening camera...'}
        />

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(undefined)}
          header={'Error'}
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default CameraScreen;
