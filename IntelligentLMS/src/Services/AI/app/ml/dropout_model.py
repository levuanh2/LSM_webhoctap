import os
import joblib
import pandas as pd
from datetime import datetime

from app.config import settings
from app.data.dataset_builder import get_progress_df
from app.utils.feature_engineering import prepare_dropout_features

def predict_dropout_risk(user_id: str) -> dict:
    """
    Loads saved Scikit-Learn Random Forest model if available.
    Otherwise uses a fallback rule-based classification.
    Returns: { "risk": LOW|MEDIUM|HIGH, "prob": dict }
    """
    df = get_progress_df()
    user_prog = df[df['user_id'] == user_id]
    
    if user_prog.empty:
        # Unknown user
        return {
            "risk": "MEDIUM",
            "prob": 0.5,
            "factors": {"unknown_user": 1.0}
        }
    
    # Calculate features
    feats_df = prepare_dropout_features(user_prog)
    
    # Take the most recent entry for prediction
    latest_feat = feats_df.iloc[-1]
    
    model_path = settings.DROPOUT_MODEL_PATH
    
    risk_labels = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
    
    if os.path.exists(model_path):
        try:
            model = joblib.load(model_path)
            X = feats_df[['progress_percentage', 'days_since_last_login', 'lessons_completed', 'login_frequency']]
            prediction_idx = model.predict(X)[0]
            prob = model.predict_proba(X)[0] 
            
            return {
                "risk": risk_labels.get(prediction_idx, "UNKNOWN"),
                "prob": float(prob.max()),
                "factors": {
                    "progress": latest_feat['progress_percentage'],
                    "days_inactive": latest_feat['days_since_last_login']
                }
            }
        except Exception as e:
            print(f"Error loading model: {e}. Falling back to rule-based.")
            
    # Fallback to Rule-based system
    progress = latest_feat['progress_percentage']
    days_inactive = latest_feat['days_since_last_login']
    
    score = 0.0
    if progress < 30: score += 0.4
    if days_inactive > 14: score += 0.6
    elif days_inactive > 7: score += 0.3
    
    risk = "LOW"
    if score >= 0.7: risk = "HIGH"
    elif score >= 0.4: risk = "MEDIUM"
        
    return {
        "risk": risk,
        "prob": score,
        "factors": {
            "progress_percentage": progress,
            "days_inactive": days_inactive
        }
    }
