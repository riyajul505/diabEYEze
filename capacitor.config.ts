import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glucose.monitor',
  appName: 'Glucose Monitor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    Permissions: {
      android: {
        permissions: [
          "android.permission.CAMERA"
        ]
      }
    },
    Camera: {
      android: {
        allowCamera: true
      }
    }
  }
};

export default config;
