import { UserHealthProfile } from '../pages/ProfileScreen';

// Local Storage Key
const PROFILE_STORAGE_KEY = 'diabeyes_user_health_profile';

// Get User Profile
export const getUserProfile = (): UserHealthProfile | null => {
  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
  return savedProfile ? JSON.parse(savedProfile) : null;
};

// Update User Profile
export const updateUserProfile = (profileUpdate: Partial<UserHealthProfile>): UserHealthProfile => {
  const currentProfile = getUserProfile() || {
    id: crypto.randomUUID(),
    name: '',
    age: 25,
    gender: 'female',
    height: 0,
    weight: 0,
    exercisePreferences: [],
    diabetesManagementGoals: [],
    isVegetarian: false,
    medicalHistory: ['diabetes']
  };

  const updatedProfile = {
    ...currentProfile,
    ...profileUpdate,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  return updatedProfile;
};

// Clear User Profile
export const clearUserProfile = () => {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
};

// Check if Profile Exists
export const hasUserProfile = (): boolean => {
  return !!localStorage.getItem(PROFILE_STORAGE_KEY);
};

// Get Specific Profile Field
export const getProfileField = <K extends keyof UserHealthProfile>(
  field: K
): UserHealthProfile[K] | undefined => {
  const profile = getUserProfile();
  return profile ? profile[field] : undefined;
};
