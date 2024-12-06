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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAlert,
  IonToggle,
  IonIcon
} from '@ionic/react';
import { 
  personOutline, 
  saveOutline, 
  refreshOutline 
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';

// Exercise Types
const EXERCISE_TYPES = [
  'Walking',
  'Running',
  'Cycling',
  'Swimming',
  'Yoga',
  'Weight Training',
  'High-Intensity Interval Training (HIIT)',
  'Pilates',
  'Dancing',
  'Hiking'
];

// Diabetes Management Goals
const DIABETES_GOALS = [
  'Weight Management',
  'Blood Sugar Control',
  'Cardiovascular Health',
  'Stress Reduction',
  'Nutrition Improvement',
  'Insulin Sensitivity'
];

// Profile Interface
export interface UserHealthProfile {
  id?: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  exercisePreferences: string[];
  diabetesManagementGoals: string[];
  isVegetarian: boolean;
  medicalHistory: string[];
  glucoseLevel?: string;
  lastUpdated?: string;
}

const ProfileScreen: React.FC = () => {
  // State Management
  const [profile, setProfile] = useState<UserHealthProfile>({
    id: uuidv4(),
    name: '',
    age: 25,
    gender: 'female',
    height: 0,
    weight: 0,
    exercisePreferences: [],
    diabetesManagementGoals: [],
    isVegetarian: false,
    medicalHistory: ['diabetes'],
    lastUpdated: new Date().toISOString()
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Local Storage Key
  const PROFILE_STORAGE_KEY = 'diabeyes_user_health_profile';

  // Load Profile on Component Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile({
        ...parsedProfile,
        id: parsedProfile.id || uuidv4()
      });
    }
  }, []);

  // Save Profile to Local Storage
  const saveProfile = () => {
    // Validate required fields
    if (!profile.name || profile.height <= 0 || profile.weight <= 0) {
      setAlertMessage('Please fill in all required fields (Name, Height, Weight)');
      setShowAlert(true);
      return;
    }

    // Update last updated timestamp
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };

    // Save to local storage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    
    // Update state
    setProfile(updatedProfile);

    // Show success message
    setAlertMessage('Profile saved successfully!');
    setShowAlert(true);
  };

  // Reset Profile
  const resetProfile = () => {
    const defaultProfile: UserHealthProfile = {
      id: uuidv4(),
      name: '',
      age: 25,
      gender: 'female',
      height: 0,
      weight: 0,
      exercisePreferences: [],
      diabetesManagementGoals: [],
      isVegetarian: false,
      medicalHistory: ['diabetes'],
      lastUpdated: new Date().toISOString()
    };

    setProfile(defaultProfile);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  // Update Profile Field
  const updateProfileField = (field: keyof UserHealthProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle Exercise Preference
  const toggleExercisePreference = (exercise: string) => {
    setProfile(prev => ({
      ...prev,
      exercisePreferences: prev.exercisePreferences.includes(exercise)
        ? prev.exercisePreferences.filter(e => e !== exercise)
        : [...prev.exercisePreferences, exercise]
    }));
  };

  // Toggle Diabetes Management Goal
  const toggleDiabetesGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      diabetesManagementGoals: prev.diabetesManagementGoals.includes(goal)
        ? prev.diabetesManagementGoals.filter(g => g !== goal)
        : [...prev.diabetesManagementGoals, goal]
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Health Profile</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={resetProfile}
          >
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* Basic Information */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personOutline} /> Personal Details
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput 
                  value={profile.name}
                  placeholder="Enter your name"
                  onIonChange={e => updateProfileField('name', e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Age</IonLabel>
                <IonInput 
                  type="number"
                  value={profile.age}
                  placeholder="Enter your age"
                  onIonChange={e => updateProfileField('age', parseInt(e.detail.value!, 10))}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Gender</IonLabel>
                <IonSelect 
                  value={profile.gender}
                  placeholder="Select Gender"
                  onIonChange={e => updateProfileField('gender', e.detail.value)}
                >
                  <IonSelectOption value="male">Male</IonSelectOption>
                  <IonSelectOption value="female">Female</IonSelectOption>
                  <IonSelectOption value="other">Other</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Height (cm)</IonLabel>
                <IonInput 
                  type="number"
                  value={profile.height}
                  placeholder="Enter your height"
                  onIonChange={e => updateProfileField('height', parseFloat(e.detail.value!))}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Weight (kg)</IonLabel>
                <IonInput 
                  type="number"
                  value={profile.weight}
                  placeholder="Enter your weight"
                  onIonChange={e => updateProfileField('weight', parseFloat(e.detail.value!))}
                />
              </IonItem>

              <IonItem>
                <IonLabel>Vegetarian</IonLabel>
                <IonToggle 
                  checked={profile.isVegetarian}
                  onIonChange={e => updateProfileField('isVegetarian', e.detail.checked)}
                />
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Exercise Preferences */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Exercise Preferences</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {EXERCISE_TYPES.map(exercise => (
              <IonButton
                key={exercise}
                color={profile.exercisePreferences.includes(exercise) ? 'primary' : 'medium'}
                fill={profile.exercisePreferences.includes(exercise) ? 'solid' : 'outline'}
                onClick={() => toggleExercisePreference(exercise)}
                className="ion-margin-bottom"
              >
                {exercise}
              </IonButton>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Diabetes Management Goals */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Diabetes Management Goals</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {DIABETES_GOALS.map(goal => (
              <IonButton
                key={goal}
                color={profile.diabetesManagementGoals.includes(goal) ? 'secondary' : 'medium'}
                fill={profile.diabetesManagementGoals.includes(goal) ? 'solid' : 'outline'}
                onClick={() => toggleDiabetesGoal(goal)}
                className="ion-margin-bottom"
              >
                {goal}
              </IonButton>
            ))}
          </IonCardContent>
        </IonCard>

        {/* Save Profile Button */}
        <IonButton 
          expand="block" 
          color="primary"
          onClick={saveProfile}
        >
          <IonIcon icon={saveOutline} slot="start" />
          Save Profile
        </IonButton>

        {/* Alert for Notifications */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Profile Update'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;
