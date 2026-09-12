import os

class Settings:
    PROJECT_NAME: str = "ColoAI-Polyp AI Microservice"
    VERSION: str = "1.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    BACKBONE_NAME: str = "Deep Neural Backbone (768d)"
    IMAGE_SIZE: int = 224
    CLASSES: list = [
        "Adenomatous Polyp",
        "Hyperplastic Polyp",
        "Serrated Polyp",
        "Other / Non-polyp",
    ]
    MODEL_VERSION: str = "v1.0.0-prod"
    FEATURE_DIM: int = 768

settings = Settings()
