# diabEYEze - AI-Powered Diabetes Management & Wellness Platform 🩺
## 🌟 Innovation / Uniqueness
diabEYEze stands out by combining cutting-edge AI technologies to revolutionize diabetes management:
- **Novel Eye-Based Diagnostics**: Leveraging computer vision and deep learning for non-invasive glucose monitoring
- **Multi-Modal AI Integration**: Unified platform combining image analysis, natural language processing, and predictive analytics 
- **Comprehensive Wellness Approach**: Holistic management covering physical health, mental wellbeing, and lifestyle factors

### 🎯 Key Problems Solved

| Problem | Current Challenge | Our Solution | Impact |
|---------|------------------|--------------|---------|
| Invasive Glucose Monitoring | • Regular finger pricks needed<br>• Expensive test strips<br>• Discomfort and infection risk | • Non-invasive eye-based monitoring<br>• AI-powered glucose estimation<br>• Real-time health tracking | • Reduced testing costs<br>• Improved patient comfort<br>• More frequent monitoring |
| Delayed DR Detection | • Late diagnosis<br>• Limited access to specialists<br>• High screening costs | • Early AI-based screening<br>• Automated retinal analysis<br>• Instant results | • Early intervention<br>• Reduced vision loss risk<br>• Cost-effective screening |
| Mental Health Support | • Limited access to counseling<br>• High therapy costs<br>• Stigma around seeking help | • 24/7 AI mental health assistant<br>• Private, judgment-free support<br>• Personalized guidance | • Improved mental wellbeing<br>• Increased support access<br>• Reduced healthcare costs |
| Diet Management | • Difficulty in meal planning<br>• Limited nutritional knowledge<br>• Time-consuming food logging | • Smart fridge photo analysis<br>• AI-powered meal suggestions<br>• Automated nutritional tracking | • Better diet adherence<br>• Informed food choices<br>• Time-efficient planning |
| Exercise Planning | • Generic workout plans<br>• Lack of personalization<br>• Safety concerns | • Personalized exercise recommendations<br>• Health-condition aware suggestions<br>• Real-time adaptation | • Safe workout routines<br>• Improved fitness outcomes<br>• Higher engagement |
| Healthcare Access | • Geographic limitations<br>• High specialist costs<br>• Long wait times | • Remote monitoring capabilities<br>• AI-powered screening<br>• Instant health insights | • Wider healthcare reach<br>• Reduced medical costs<br>• Faster interventions |

> **Key Statistics:**
> - Over 537 million adults living with diabetes globally
> - 50% of diabetic patients develop retinopathy
> - 25-30% of diabetics experience mental health challenges
> - Early detection can prevent up to 95% of severe vision loss cases

Our comprehensive solution addresses these challenges through an integrated approach combining AI, mobile technology, and healthcare expertise.

## 🎯 Technical Implementation
### Core Features & AI Models
#### 1. Eye-Based Health Analysis
- **Diabetic Retinopathy Detection**
  - Custom PyTorch model deployed on Hugging Face Spaces
  - Real-time image processing and analysis
  - [Model Space](https://huggingface.co/spaces/sartizAyon/iubat)

- **Glucose Level Estimation**
  - Non-invasive monitoring through retinal analysis
  - Advanced image processing pipeline
  - Integration with historical patient data

- **Eye Detection & Validation**
  - [Specialized model](https://www.kaggle.com/code/syednsakib/human-eyes-detection-open-close) for eye image validation
  - Ensures accurate input for analysis

#### 2. Intelligent Health Assistant
- **Mental Health Support**
  - Google's Gemini-powered conversational AI
  - Contextual understanding of user concerns
  - Personalized support and recommendations

- **Medication Management**
  - Smart medication tracking
  - Interaction warnings
  - Reminder system

#### 3. Lifestyle Management
- **AI Exercise Coach**
  - Personalized workout plans
  - Real-time exercise suggestions
  - Progress tracking

- **Smart Meal Planning**
  - Computer vision for food recognition
  - Nutritional analysis from fridge photos
  - Diabetic-friendly meal suggestions

### Technical Stack
```javascript
{
  "frontend": {
    "framework": ["Ionic", "React", "TypeScript"],
    "state-management": ["Context API"],
    "ui": ["Ionic Components", "Custom Components"]
  },
  "backend": {
    "server": ["Node.js", "Express"],
    "ai-integration": ["TensorFlow", "PyTorch", "XGBoost"],
    "external-services": ["Google Gemini", "Hugging Face"]
  },
  "deployment": {
    "models": ["Hugging Face Spaces"],
    "api": ["Vercel"]
  }
}
```

## 🌍 Potential Social Impact
### Healthcare Accessibility
- **Reduced Diagnostic Costs**: Non-invasive monitoring reduces need for frequent blood tests
- **Remote Healthcare**: Enables remote health monitoring and consultation
- **Early Detection**: AI-powered screening for early diabetes complications

### Mental Health Support
- **Reduced Stigma**: Private, judgment-free environment for mental health discussions
- **Preventive Care**: Early intervention through regular mental health check-ins

## 👤 User Experience
- **Cross Platfrom Support**: PWA, so can run on any device. 
- **Intuitive Mobile Interface**: Native-like experience through Ionic
- **Seamless Integration**: All features accessible within single app
- **Privacy-Focused**: Secure handling of sensitive health data
- **Offline Capability**: Core features available without internet
- **Cross-Platform**: Works on both iOS and Android

## 🎯 Alignment with SDG Objectives
### SDG 3: Good Health and Well-being
- Improves access to healthcare
- Promotes preventive health measures
- Supports mental health care

## 🔗 Resources
- [Backend Repository](https://github.com/sartizalamayon/DiabEYEze-Backend)
- [DR Detection Model](https://huggingface.co/spaces/sartizAyon/iubat)
- [Eye Detection Model](https://www.kaggle.com/code/syednsakib/human-eyes-detection-open-close)
- [Glucose Detection Model](https://www.kaggle.com/code/syednazmussakib/notebook3f8be03d46)

## 🚀 Getting Started
```bash
# Clone the repository
git clone https://github.com/your-username/diabeyeze.git

# Install dependencies
cd diabeyeze
npm install

# Start the development server
ionic serve
```

## 👥 Team
- Sartiz Alam Ayon - Team Lead & Backend Development
- Md Nazmus Sakib - ML Engineering
- Riyazul Islam - Full Stack Development

<div align="center">
Built with ❤️ for a healthier future
</div>
