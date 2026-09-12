import time
from app.utils.image_processing import preprocess_image, generate_attention_heatmap
from app.models.convnext_extractor import ConvNeXtV2FeatureExtractor
from app.models.xgboost_classifier import XGBoostPolypClassifier
from app.models.shap_explainer import SHAPExplainer
from app.core.config import settings

class PolypInferencePipeline:
    def __init__(self):
        self.feature_extractor = ConvNeXtV2FeatureExtractor(feature_dim=settings.FEATURE_DIM)
        self.classifier = XGBoostPolypClassifier(classes=settings.CLASSES)
        self.explainer = SHAPExplainer(feature_dim=settings.FEATURE_DIM)

    def process_image(self, image_bytes: bytes, model_version: str = None) -> dict:
        start_time = time.time()

        # Step 1: Preprocessing (224x224, normalized float32 tensor)
        pil_image, normalized_array = preprocess_image(image_bytes, (settings.IMAGE_SIZE, settings.IMAGE_SIZE))

        # Step 2: ConvNeXt V2 Feature Extraction (768-d embedding)
        features = self.feature_extractor.extract_features(normalized_array)

        # Step 3: XGBoost Multi-Class Classification
        predicted_class, confidence, probabilities = self.classifier.predict(features)

        # Step 4: SHAP TreeExplainer Feature Importance
        feature_contributions = self.explainer.compute_explanations(features, predicted_class)

        # Step 5: Visual Attention / Saliency Heatmap Overlay
        heatmap_base64 = generate_attention_heatmap(pil_image, predicted_class)

        elapsed_ms = int((time.time() - start_time) * 1000)

        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
            "probabilities": probabilities,
            "model_version": model_version or settings.MODEL_VERSION,
            "backbone": settings.BACKBONE_NAME,
            "classifier": "XGBoost Multi-Class Classifier",
            "processing_time_ms": elapsed_ms,
            "feature_contributions": feature_contributions,
            "heatmap_base64": heatmap_base64,
        }

pipeline = PolypInferencePipeline()
