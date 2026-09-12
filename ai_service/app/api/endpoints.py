from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from app.models.pipeline import pipeline
from app.schemas.prediction_schema import PredictionResponse, ExplanationResponse, ModelInfoResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "backbone": settings.BACKBONE_NAME,
        "classes_count": len(settings.CLASSES),
    }

@router.get("/model/info", response_model=ModelInfoResponse)
def get_model_info():
    return {
        "name": "Explainable Deep Hybrid Classifier",
        "version": settings.MODEL_VERSION,
        "backbone": settings.BACKBONE_NAME,
        "classifier": "Ensemble Gradient Classifier",
        "classes": settings.CLASSES,
        "feature_dim": settings.FEATURE_DIM,
        "status": "Production",
    }

@router.post("/predict", response_model=PredictionResponse)
async def predict_polyp(
    file: UploadFile = File(...),
    model_version: Optional[str] = Form(None)
):
    # Validate MIME type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Please provide a JPEG, PNG, or WEBP colonoscopy image."
        )

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty image file provided.")

        result = pipeline.process_image(image_bytes, model_version)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/explain", response_model=ExplanationResponse)
async def explain_polyp(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = pipeline.process_image(image_bytes)
        return {
            "predicted_class": result["predicted_class"],
            "confidence": result["confidence"],
            "feature_contributions": result["feature_contributions"],
            "heatmap_base64": result["heatmap_base64"],
            "summary": f"Prediction driven by high positive contribution of {result['feature_contributions'][0]['name']}."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation generation error: {str(e)}")
