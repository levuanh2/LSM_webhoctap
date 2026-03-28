from fastapi import APIRouter
from app.services.dropout_predictor import DropoutPredictorService
from app.models.user_progress import DropoutRiskResponse

router = APIRouter(prefix="/ai/dropout-risk", tags=["Dropout Analysis"])

@router.get("/{userId}", response_model=DropoutRiskResponse)
def get_dropout_risk(userId: str):
    risk_info = DropoutPredictorService.evaluate_risk(userId)
    
    return DropoutRiskResponse(
        user_id=userId,
        risk_level=risk_info["risk"],
        probability=risk_info["prob"],
        factors=risk_info.get("factors", {})
    )
