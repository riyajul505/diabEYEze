import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  RefresherEventDetail,
  IonSkeletonText
} from '@ionic/react';
import { 
  restaurantOutline, 
  timeOutline, 
  warningOutline,
  refreshOutline 
} from 'ionicons/icons';

interface MealPlan {
  mealType: string;
  time: string;
  items: string[];
  calories: number;
  glucoseImpact: 'Low' | 'Moderate' | 'High';
  notes?: string;
}

interface DietPlan {
  glucoseLevel: number;
  category: 'Low' | 'Normal' | 'High' | 'Very High';
  totalCalories: number;
  meals: MealPlan[];
  recommendations: string[];
  lastUpdated: string;
}

const DietScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Low': return 'warning';
      case 'Normal': return 'success';
      case 'High': return 'danger';
      case 'Very High': return 'danger';
      default: return 'medium';
    }
  };

  const getGlucoseCategory = (level: number): 'Low' | 'Normal' | 'High' | 'Very High' => {
    if (level < 70) return 'Low';
    if (level <= 140) return 'Normal';
    if (level <= 200) return 'High';
    return 'Very High';
  };

  // Mock API call - replace with real API when ready
  const fetchDietPlan = async (glucoseLevel: number): Promise<DietPlan> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data based on glucose level
    const category = getGlucoseCategory(glucoseLevel);
    
    return {
      glucoseLevel,
      category,
      totalCalories: category === 'High' ? 1800 : 2000,
      lastUpdated: new Date().toISOString(),
      meals: [
        {
          mealType: 'Breakfast',
          time: '8:00 AM',
          items: category === 'High' 
            ? ['Oatmeal with berries', 'Sugar-free yogurt', 'Green tea']
            : ['Whole grain toast', 'Scrambled eggs', 'Fresh fruit'],
          calories: 400,
          glucoseImpact: 'Low'
        },
        {
          mealType: 'Lunch',
          time: '1:00 PM',
          items: category === 'High'
            ? ['Grilled chicken salad', 'Quinoa', 'Steamed vegetables']
            : ['Turkey sandwich', 'Mixed salad', 'Apple'],
          calories: 500,
          glucoseImpact: 'Moderate'
        },
        {
          mealType: 'Dinner',
          time: '7:00 PM',
          items: category === 'High'
            ? ['Baked fish', 'Brown rice', 'Roasted vegetables']
            : ['Grilled chicken', 'Sweet potato', 'Green beans'],
          calories: 600,
          glucoseImpact: 'Moderate'
        }
      ],
      recommendations: category === 'High'
        ? [
            'Limit carbohydrate intake',
            'Increase fiber-rich foods',
            'Avoid sugary drinks',
            'Eat smaller portions more frequently'
          ]
        : [
            'Maintain balanced meals',
            'Include protein with each meal',
            'Stay hydrated',
            'Monitor portion sizes'
          ]
    };
  };

  const loadDietPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get glucose level from localStorage (fallback to mock value if not found)
      const storedGlucoseLevel = localStorage.getItem('glucoseLevel');
      const glucoseLevel = storedGlucoseLevel ? parseFloat(storedGlucoseLevel) : 130;
      
      const plan = await fetchDietPlan(glucoseLevel);
      setDietPlan(plan);
      
      // Save the plan to localStorage
      localStorage.setItem('currentDietPlan', JSON.stringify(plan));
    } catch (err) {
      setError('Failed to load diet plan. Please try again.');
      console.error('Error loading diet plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDietPlan();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadDietPlan();
    event.detail.complete();
  };

  const renderMealCard = (meal: MealPlan) => (
    <IonCard key={meal.mealType}>
      <IonCardHeader>
        <IonCardSubtitle>
          <IonIcon icon={timeOutline} /> {meal.time}
        </IonCardSubtitle>
        <IonCardTitle>{meal.mealType}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {meal.items.map((item, index) => (
            <IonItem key={index} lines="none">
              <IonIcon icon={restaurantOutline} slot="start" />
              <IonLabel>{item}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <div className="ion-padding-top">
          <IonBadge color="medium">{meal.calories} calories</IonBadge>
          <IonBadge 
            color={meal.glucoseImpact === 'Low' ? 'success' : 'warning'}
            className="ion-margin-start"
          >
            {meal.glucoseImpact} Impact
          </IonBadge>
        </div>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Diet Plan</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => loadDietPlan()}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div className="ion-padding">
            {[1, 2, 3].map(i => (
              <IonCard key={i}>
                <IonCardHeader>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </IonCardHeader>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '90%' }} />
                  <IonSkeletonText animated style={{ width: '80%' }} />
                  <IonSkeletonText animated style={{ width: '70%' }} />
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        ) : error ? (
          <div className="ion-padding ion-text-center">
            <IonIcon 
              icon={warningOutline} 
              color="danger"
              style={{ fontSize: '48px' }}
            />
            <p>{error}</p>
            <IonButton onClick={loadDietPlan}>
              Try Again
            </IonButton>
          </div>
        ) : dietPlan && (
          <div className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Current Status</IonCardSubtitle>
                <IonCardTitle className="ion-padding-top">
                  Glucose Level: {dietPlan.glucoseLevel} mg/dL
                  <IonBadge 
                    color={getCategoryColor(dietPlan.category)}
                    className="ion-margin-start"
                  >
                    {dietPlan.category}
                  </IonBadge>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Daily Calorie Target: {dietPlan.totalCalories} kcal</p>
                <p className="ion-padding-top">
                  Last Updated: {new Date(dietPlan.lastUpdated).toLocaleString()}
                </p>
              </IonCardContent>
            </IonCard>

            {dietPlan.meals.map(renderMealCard)}

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Recommendations</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {dietPlan.recommendations.map((rec, index) => (
                    <IonItem key={index} lines="none">
                      <IonIcon icon={restaurantOutline} slot="start" />
                      <IonLabel>{rec}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DietScreen;
