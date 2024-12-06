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
  IonAlert 
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const CameraScreen: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        const { camera } = await Camera.checkPermissions();
        if (camera !== 'granted') {
          const { camera: requestedPermission } = await Camera.requestPermissions();
          if (requestedPermission !== 'granted') {
            setError('Camera permissions are required to use this feature');
          }
        }
      }
    };
    checkPermissions();
  }, []);

  const takePicture = async () => {
    try {
      setLoading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      setPhoto(image.dataUrl);
      setError(null);
    } catch (error) {
      console.error('Error taking picture', error);
      setError('Failed to capture image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = () => {
    // Placeholder for future AI analysis
    console.log('Analyzing image...');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Eye Glucose Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading 
          isOpen={loading}
          message={'Capturing image...'}
        />

        {error && (
          <IonAlert
            isOpen={!!error}
            onDidDismiss={() => setError(null)}
            header={'Error'}
            message={error}
            buttons={['OK']}
          />
        )}

        <div style={{ textAlign: 'center' }}>
          <IonButton onClick={takePicture}>
            Capture Eye Image
          </IonButton>

          {photo && (
            <div>
              <IonImg src={photo} style={{ maxHeight: '300px', margin: '20px auto' }} />
              <IonButton color="secondary" onClick={analyzeImage}>
                Analyze Image
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CameraScreen;
