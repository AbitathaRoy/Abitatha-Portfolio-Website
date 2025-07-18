import { DataSciencePost } from '../types/DataSciencePost';

export const dataSciencePosts: DataSciencePost[] = [
  {
    id: "1",
    title: "Customer Churn Prediction Model",
    description: "Built a machine learning model to predict customer churn using ensemble methods, achieving 89% accuracy with feature engineering and hyperparameter tuning.",
    content: `# Customer Churn Prediction: A Deep Dive

Customer churn prediction is one of the most critical challenges in business analytics. In this project, I developed a comprehensive machine learning solution that achieved **89% accuracy** in predicting customer churn.

![Model Performance](https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200)

## The Challenge

Customer acquisition costs are typically 5-25 times higher than retention costs. By identifying customers likely to churn, businesses can:

- Implement targeted retention strategies
- Optimize marketing spend
- Improve customer lifetime value

## Methodology

### 1. Data Collection & Exploration

The dataset contained **10,000 customer records** with 20+ features including:
- Demographics (age, gender, location)
- Usage patterns (monthly charges, tenure)
- Service details (contract type, payment method)
- Support interactions (complaints, satisfaction scores)

### 2. Feature Engineering

Key engineered features that improved model performance:

\`\`\`python
# Customer lifetime value calculation
df['CLV'] = df['monthly_charges'] * df['tenure']

# Churn risk score based on support tickets
df['support_risk'] = df['complaints'] / (df['tenure'] + 1)

# Contract stability indicator
df['contract_stability'] = df['contract_length'] * df['auto_pay']
\`\`\`

![Feature Importance](https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1200)

### 3. Model Selection & Training

I tested multiple algorithms:

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Random Forest | 87% | 0.85 | 0.82 | 0.83 |
| XGBoost | **89%** | **0.88** | **0.85** | **0.86** |
| Logistic Regression | 82% | 0.80 | 0.78 | 0.79 |

**XGBoost emerged as the winner** due to its superior handling of feature interactions and robustness to outliers.

## Key Insights

The model revealed fascinating patterns:

1. **Contract type** was the strongest predictor (35% feature importance)
2. **Monthly charges** above $70 significantly increased churn risk
3. **Customer service interactions** were highly predictive when combined with tenure

![Insights Dashboard](https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200)

## Business Impact

The deployed model enabled:
- **23% reduction** in customer churn
- **$2.3M annual savings** in retention costs
- **Proactive intervention** for high-risk customers

## Technical Implementation

The solution was deployed using:
- **FastAPI** for model serving
- **Docker** for containerization
- **AWS Lambda** for serverless inference
- **Streamlit** for business dashboard

## Future Enhancements

Next steps include:
- Real-time prediction pipeline
- A/B testing framework for interventions
- Deep learning models for sequential data
- Integration with CRM systems`,
    media: [
      {
        id: "1",
        type: "image",
        url: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200",
        caption: "Model Performance Dashboard",
        alt: "Dashboard showing model accuracy metrics"
      },
      {
        id: "2", 
        type: "image",
        url: "https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1200",
        caption: "Feature Importance Analysis",
        alt: "Chart showing feature importance scores"
      },
      {
        id: "3",
        type: "image", 
        url: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
        caption: "Business Insights Dashboard",
        alt: "Interactive dashboard with business metrics"
      }
    ],
    tags: ["Python", "Scikit-learn", "Pandas", "XGBoost", "Machine Learning"],
    createdOn: "2024-12-01T10:00:00Z",
    updatedOn: "2024-12-15T14:30:00Z",
    githubUrl: "https://github.com/username/churn-prediction",
    demoUrl: "https://churn-demo.streamlit.app",
    datasetUrl: "https://kaggle.com/dataset/customer-churn",
    featured: true,
    methodology: ["Data Exploration", "Feature Engineering", "Model Selection", "Hyperparameter Tuning", "Cross Validation"],
    results: "Achieved 89% accuracy with XGBoost, leading to 23% reduction in customer churn and $2.3M annual savings.",
    status: "completed"
  },
  {
    id: "2",
    title: "Sales Forecasting Dashboard",
    description: "Interactive dashboard for sales forecasting using time series analysis with ARIMA and Prophet models, deployed on Streamlit.",
    content: `# Sales Forecasting: Predicting the Future of Business

Time series forecasting is crucial for business planning. This project combines traditional ARIMA models with Facebook's Prophet to create accurate sales predictions.

## Overview

Built an end-to-end forecasting solution that processes historical sales data and generates predictions with confidence intervals.

## Technical Approach

- **ARIMA modeling** for trend analysis
- **Prophet** for seasonal decomposition  
- **Interactive Streamlit** dashboard
- **Real-time data** integration

## Results

The model achieved **MAPE of 8.2%** on test data, significantly outperforming previous manual forecasting methods.`,
    media: [
      {
        id: "4",
        type: "image",
        url: "https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1200",
        caption: "Sales Forecasting Dashboard",
        alt: "Interactive dashboard showing sales predictions"
      }
    ],
    tags: ["Python", "Prophet", "Streamlit", "Plotly", "Time Series"],
    createdOn: "2024-11-15T09:00:00Z",
    updatedOn: "2024-11-20T16:45:00Z",
    githubUrl: "https://github.com/username/sales-forecasting",
    demoUrl: "https://sales-forecast.streamlit.app",
    featured: false,
    methodology: ["Time Series Analysis", "ARIMA Modeling", "Prophet Implementation", "Dashboard Development"],
    results: "MAPE of 8.2% on test data, deployed interactive dashboard for business users.",
    status: "completed"
  },
  {
    id: "3",
    title: "Sentiment Analysis of Social Media",
    description: "NLP project analyzing sentiment patterns in social media posts using BERT and traditional ML approaches for comparison.",
    content: `# Social Media Sentiment Analysis: Understanding Public Opinion

This project explores sentiment analysis using both traditional machine learning and modern transformer models to understand public opinion on social media.

## Methodology

Compared multiple approaches:
- **Traditional ML**: TF-IDF + SVM
- **Deep Learning**: LSTM networks
- **Transformers**: BERT fine-tuning

## Key Findings

BERT achieved **94% accuracy** on sentiment classification, significantly outperforming traditional approaches while providing better context understanding.`,
    media: [
      {
        id: "5",
        type: "image",
        url: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
        caption: "Sentiment Analysis Results",
        alt: "Comparison of different sentiment analysis models"
      }
    ],
    tags: ["NLP", "BERT", "PyTorch", "Transformers", "Sentiment Analysis"],
    createdOn: "2024-10-20T11:30:00Z",
    updatedOn: "2024-10-25T13:15:00Z",
    githubUrl: "https://github.com/username/sentiment-analysis",
    demoUrl: "https://sentiment-demo.herokuapp.com",
    featured: true,
    methodology: ["Data Collection", "Text Preprocessing", "Model Comparison", "BERT Fine-tuning"],
    results: "94% accuracy with BERT, comprehensive comparison of traditional vs modern NLP approaches.",
    status: "completed"
  }
];