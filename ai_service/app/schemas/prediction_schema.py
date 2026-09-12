from typing import List, Optional
from pydantic import BaseModel

class ClassProbability(BaseModel):
    className: str
    probability: float

class FeatureContribution(BaseModel):
    featureId: str
    name: str
    contribution: float
    description: Optional[str] = None

class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: List[ClassProbability]
    model_version: str
    backbone: str
    classifier: str
    processing_time_ms: int
    feature_contributions: List[FeatureContribution]
    heatmap_base64: Optional[str] = None

class ExplanationResponse(BaseModel):
    predicted_class: str
    confidence: float
    feature_contributions: List[FeatureContribution]
    heatmap_base64: Optional[str] = None
    summary: str

class ModelInfoResponse(BaseModel):
    name: str
    version: str
    backbone: str
    classifier: str
    classes: List[str]
    feature_dim: int
    status: str
