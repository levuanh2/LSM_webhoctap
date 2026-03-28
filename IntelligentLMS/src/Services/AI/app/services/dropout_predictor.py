from app.ml.dropout_model import predict_dropout_risk

class DropoutPredictorService:
    @staticmethod
    def evaluate_risk(user_id: str) -> dict:
        return predict_dropout_risk(user_id)
