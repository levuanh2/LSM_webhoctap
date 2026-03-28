import pandas as pd
import numpy as np
from datetime import datetime

def prepare_dropout_features(progress_df: pd.DataFrame) -> pd.DataFrame:
    """
    Given progress.csv dataframe, calculate derived features for ML model.
    """
    if progress_df.empty:
        return pd.DataFrame(columns=['progress_percentage', 'days_since_last_login', 'lessons_completed', 'login_frequency', 'risk_label'])

    df = progress_df.copy()
    
    # Fill NA
    df['progress_percentage'] = df['progress_percentage'].fillna(0.0)
    df['lessons_completed'] = df['lessons_completed'].fillna(0)
    
    now = datetime.utcnow()
    df['last_login'] = pd.to_datetime(df['last_login'], errors='coerce')
    
    # Calculate days since last login
    df['days_since_last_login'] = (now - df['last_login']).dt.days
    df['days_since_last_login'] = df['days_since_last_login'].fillna(30) # Default to 30 if missing
    
    # Fake login_frequency as a derived score: higher lessons completed in short time = higher frequency
    # Assuming standard duration is 30 days
    df['login_frequency'] = np.where(df['days_since_last_login'] == 0, 1.0, 1.0 / df['days_since_last_login'])
    
    # Generates a pseudo ground truth label "risk_label" just for training purposes
    # Risk is high(2) if progress is low and days since last login is high
    conditions = [
        (df['progress_percentage'] < 20) & (df['days_since_last_login'] > 14),
        (df['progress_percentage'] < 50) & (df['days_since_last_login'] > 7)
    ]
    choices = [2, 1] # 2: HIGH, 1: MEDIUM
    df['risk_label'] = np.select(conditions, choices, default=0) # 0: LOW

    return df
