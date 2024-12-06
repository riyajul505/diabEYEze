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
  IonSkeletonText,
  IonAlert,
  IonLoading,
  IonModal,
  IonText,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  restaurantOutline, 
  timeOutline, 
  warningOutline,
  refreshOutline,
  cameraOutline,
  closeCircleOutline,
  addCircleOutline,
  removeCircleOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';

// Ensure you have a secure way to store and access the API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

// Spoonacular API configuration
const SPOONACULAR_API_KEY = '0d24995570b849b3821c28b7f6f608ba'; // Replace with actual key
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

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

const INGREDIENT_DETECTION_RULES = [
  {
    keywords: ['tomato', 'red', 'round'],
    ingredients: ['tomato', 'onion', 'garlic', 'cheese', 'olive oil']
  },
  {
    keywords: ['green', 'leafy'],
    ingredients: ['lettuce', 'spinach', 'cucumber', 'eggs', 'olive oil']
  },
  {
    keywords: ['yellow', 'round'],
    ingredients: ['potato', 'onion', 'cheese', 'eggs', 'butter']
  }
];

const DietScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([
    'tomato', 'onion', 'garlic', 'potato', 'carrot', 
    'chicken', 'beef', 'fish', 'eggs', 'milk', 
    'cheese', 'bread', 'rice', 'pasta', 'flour', 
    'sugar', 'salt', 'pepper', 'olive oil', 'butter'
  ]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showRecipeDetailsModal, setShowRecipeDetailsModal] = useState(false);

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

  const takeFridgePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const base64Image = `data:image/jpeg;base64,${image.base64String}`;
      setCapturedImage(base64Image);
      
      // Simulate ingredient detection
      detectIngredientsFromImage(base64Image);
    } catch (error) {
      console.error('Error taking picture', error);
      setError('Failed to capture image. Please try again.');
    }
  };

  const detectIngredientsFromImage = (base64Image: string) => {
    // Simulate image detection based on predefined rules
    // In a real app, this would use a computer vision API
    const detectionResult = INGREDIENT_DETECTION_RULES.find(rule => 
      rule.keywords.some(keyword => base64Image.toLowerCase().includes(keyword))
    );

    if (detectionResult) {
      setDetectedIngredients(detectionResult.ingredients);
      setShowIngredientsModal(true);
    } else {
      setError('Could not detect ingredients. Please select manually.');
      setShowIngredientsModal(true);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setAvailableIngredients(availableIngredients.filter(ing => ing !== ingredient));
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing !== ingredient));
    setAvailableIngredients([...availableIngredients, ingredient]);
  };

  const findRecipesWithIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowIngredientsModal(false);

      const response = await axios.get(`${SPOONACULAR_BASE_URL}/findByIngredients`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients: selectedIngredients.join(',+'),
          number: 5,
          ranking: 1
        }
      });

      setRecipes(response.data);
      setShowRecipesModal(true);
    } catch (error) {
      console.error('Error finding recipes', error);
      setError('Failed to find recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (recipeId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SPOONACULAR_BASE_URL}/${recipeId}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true
        }
      });

      setSelectedRecipe(response.data);
      setShowRecipeDetailsModal(true);
    } catch (error) {
      console.error('Error getting recipe details', error);
      setError('Failed to load recipe details.');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    loadDietPlan();
  }, []);

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

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={cameraOutline} /> Fridge Recipe Generator
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Take a picture of the ingredients in your fridge, and we'll suggest recipes!</p>
                
                <IonButton 
                  expand="block" 
                  onClick={takeFridgePicture}
                >
                  <IonIcon icon={cameraOutline} slot="start" />
                  Take Fridge Picture
                </IonButton>

                {capturedImage && (
                  <div className="ion-margin-top ion-text-center">
                    <img 
                      src={capturedImage} 
                      alt="Captured Fridge Contents" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </div>
                )}
              </IonCardContent>
            </IonCard>

            {/* Ingredients Selection Modal */}
            <IonModal 
              isOpen={showIngredientsModal} 
              onDidDismiss={() => setShowIngredientsModal(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Select Ingredients</IonTitle>
                  <IonButton 
                    slot="end" 
                    fill="clear" 
                    onClick={findRecipesWithIngredients}
                    disabled={selectedIngredients.length === 0}
                  >
                    Find Recipes
                  </IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                {/* Detected Ingredients */}
                {detectedIngredients.length > 0 && (
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Detected Ingredients</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {detectedIngredients.map((ing) => (
                        <IonChip 
                          key={ing} 
                          color="primary"
                          outline={!selectedIngredients.includes(ing)}
                          onClick={() => {
                            if (selectedIngredients.includes(ing)) {
                              removeIngredient(ing);
                            } else {
                              addIngredient(ing);
                            }
                          }}
                        >
                          <IonLabel>{ing}</IonLabel>
                          <IonIcon 
                            icon={selectedIngredients.includes(ing) ? removeCircleOutline : addCircleOutline} 
                          />
                        </IonChip>
                      ))}
                    </IonCardContent>
                  </IonCard>
                )}

                {/* Selected Ingredients */}
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Selected Ingredients</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {selectedIngredients.length > 0 ? (
                      <div>
                        {selectedIngredients.map((ing) => (
                          <IonChip key={ing} color="success">
                            <IonLabel>{ing}</IonLabel>
                            <IonIcon 
                              icon={removeCircleOutline} 
                              onClick={() => removeIngredient(ing)}
                            />
                          </IonChip>
                        ))}
                      </div>
                    ) : (
                      <p>No ingredients selected yet</p>
                    )}
                  </IonCardContent>
                </IonCard>

                {/* Additional Ingredients */}
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Add More Ingredients</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {availableIngredients.map((ing) => (
                      <IonChip 
                        key={ing} 
                        outline 
                        color="secondary"
                        onClick={() => addIngredient(ing)}
                      >
                        <IonLabel>{ing}</IonLabel>
                        <IonIcon icon={addCircleOutline} />
                      </IonChip>
                    ))}
                  </IonCardContent>
                </IonCard>
              </IonContent>
            </IonModal>

            {/* Recipes Modal */}
            <IonModal 
              isOpen={showRecipesModal} 
              onDidDismiss={() => setShowRecipesModal(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Suggested Recipes</IonTitle>
                  <IonButton 
                    slot="end" 
                    fill="clear" 
                    onClick={() => setShowRecipesModal(false)}
                  >
                    <IonIcon icon={closeCircleOutline} />
                  </IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList>
                  {recipes.map((recipe) => (
                    <IonItem 
                      key={recipe.id} 
                      onClick={() => getRecipeDetails(recipe.id)}
                    >
                      <IonLabel>
                        <h2>{recipe.title}</h2>
                        <p>
                          <IonBadge color="success" style={{ marginRight: '10px' }}>
                            Used: {recipe.usedIngredientCount}
                          </IonBadge>
                          <IonBadge color="warning">
                            Missing: {recipe.missedIngredientCount}
                          </IonBadge>
                        </p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonContent>
            </IonModal>

            {/* Recipe Details Modal */}
            <IonModal 
              isOpen={showRecipeDetailsModal} 
              onDidDismiss={() => setShowRecipeDetailsModal(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Recipe Details</IonTitle>
                  <IonButton 
                    slot="end" 
                    fill="clear" 
                    onClick={() => setShowRecipeDetailsModal(false)}
                  >
                    <IonIcon icon={closeCircleOutline} />
                  </IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                {selectedRecipe && (
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonCard>
                          <img 
                            src={selectedRecipe.image} 
                            alt={selectedRecipe.title} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                          <IonCardHeader>
                            <IonCardTitle>{selectedRecipe.title}</IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <h3>Ingredients:</h3>
                            <IonList>
                              {selectedRecipe.extendedIngredients.map((ing: any) => (
                                <IonItem key={ing.id}>
                                  <IonLabel>{ing.original}</IonLabel>
                                </IonItem>
                              ))}
                            </IonList>

                            <h3>Instructions:</h3>
                            <ol>
                              {selectedRecipe.analyzedInstructions[0]?.steps.map((step: any) => (
                                <li key={step.number}>{step.step}</li>
                              ))}
                            </ol>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                )}
              </IonContent>
            </IonModal>
          </div>
        )}
      </IonContent>

      {/* Loading Indicator */}
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Generating recipe...'}
      />

      {/* Error Alert */}
      <IonAlert
        isOpen={!!error}
        onDidDismiss={() => setError(null)}
        header={'Error'}
        message={error}
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default DietScreen;
