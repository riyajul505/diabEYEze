import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  chatbubbleOutline, 
  nutritionOutline, 
  cameraOutline,
  personOutline,
  statsChartOutline,
  heartOutline
} from 'ionicons/icons';

// Import Pages
import ChatScreen from './pages/ChatScreen';
import CameraScreen from './pages/CameraScreen';
import DietScreen from './pages/DietScreen';
import ProfileScreen from './pages/ProfileScreen';
import HealthInsightsScreen from './pages/HealthInsightsScreen';
import ExercisePlanScreen from './pages/ExercisePlanScreen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/camera">
            <CameraScreen />
          </Route>
          <Route exact path="/insights">
            <HealthInsightsScreen />
          </Route>
          <Route exact path="/exercise">
            <ExercisePlanScreen />
          </Route>
          <Route exact path="/chat">
            <ChatScreen />
          </Route>
          <Route exact path="/diet">
            <DietScreen />
          </Route>
          <Route exact path="/profile">
            <ProfileScreen />
          </Route>
          <Route exact path="/">
            <Redirect to="/camera" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="camera" href="/camera">
            <IonIcon icon={cameraOutline} />
            <IonLabel>Scan</IonLabel>
          </IonTabButton>
          <IonTabButton tab="insights" href="/insights">
            <IonIcon icon={statsChartOutline} />
            <IonLabel>Insights</IonLabel>
          </IonTabButton>
          <IonTabButton tab="exercise" href="/exercise">
            <IonIcon icon={heartOutline} />
            <IonLabel>Exercise</IonLabel>
          </IonTabButton>
          <IonTabButton tab="chat" href="/chat">
            <IonIcon icon={chatbubbleOutline} />
            <IonLabel>Chat</IonLabel>
          </IonTabButton>
          <IonTabButton tab="diet" href="/diet">
            <IonIcon icon={nutritionOutline} />
            <IonLabel>Diet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
