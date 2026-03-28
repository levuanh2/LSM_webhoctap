import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

from app.config import settings
from app.data.dataset_builder import get_progress_df
from app.utils.feature_engineering import prepare_dropout_features

def train_dropout_model():
    """
    Train RandomForestClassifier for Dropout prediction
    """
    df = get_progress_df()
    df_features = prepare_dropout_features(df)
    
    if len(df_features) < 10:
        print("Not enough data to train dropout model realistically, using mock logic.")
        return

    X = df_features[['progress_percentage', 'days_since_last_login', 'lessons_completed', 'login_frequency']]
    y = df_features['risk_label']

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    
    joblib.dump(clf, settings.DROPOUT_MODEL_PATH)
    print("Dropout model trained and saved to", settings.DROPOUT_MODEL_PATH)

def train_recommender_model():
    """
    Mock saving a dummy file simply to satisfy local storage pipeline
    In actual implementations, we might pre-compute a similarity matrix.
    Since we compute it dynamically, we might just save state.
    """
    dummy_state = {"version": "1.0", "type": "hybrid"}
    joblib.dump(dummy_state, settings.RECOMMENDATION_MODEL_PATH)
    print("Recommender model state saved.")

def retrain_all_models():
    train_dropout_model()
    train_recommender_model()

if __name__ == "__main__":
    retrain_all_models()
