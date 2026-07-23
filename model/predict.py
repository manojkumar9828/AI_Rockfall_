"""
Prediction utility for the Rockfall CNN model.

Provides predict_image() that loads an image, resizes it to 224x224,
normalizes pixel values, runs inference, and returns the predicted
class label, confidence score, and risk level.
"""
import json
import time
from pathlib import Path

import numpy as np
from PIL import Image
import tensorflow as tf  # type: ignore[import]

from model.cnn_model import build_model, CLASS_NAMES, save_class_names

MODEL_DIR = Path(__file__).resolve().parent
MODEL_PATH = MODEL_DIR / "rockfall_model.h5"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"
IMG_SIZE = 224

RISK_LEVELS = {"Safe": "Low", "Warning": "Medium", "Dangerous": "High"}

_model = None
_class_names = None
_model_img_size = IMG_SIZE


def _load_model():
    """Lazy-load the trained Keras model and class names."""
    global _model, _class_names, _model_img_size
    if _model is None:
        if not MODEL_PATH.exists() or MODEL_PATH.stat().st_size == 0:
            raise FileNotFoundError(
                f"Model file missing or empty: {MODEL_PATH}. "
                "Train a valid model with python model/train_model.py"
            )

        try:
            model = tf.keras.models.load_model(MODEL_PATH)
        except (OSError, IOError, ValueError, tf.errors.OpError) as exc:
            raise RuntimeError(
                f"Failed to load model {MODEL_PATH}: {exc}. "
                "Train a valid model with python model/train_model.py"
            ) from exc

        if not CLASS_NAMES_PATH.exists():
            raise FileNotFoundError(
                f"Class names file missing: {CLASS_NAMES_PATH}. "
                "Run python model/train_model.py to regenerate it."
            )

        class_names = json.loads(CLASS_NAMES_PATH.read_text())
        if len(class_names) != len(CLASS_NAMES):
            raise ValueError(
                f"Unexpected class_names length {len(class_names)}. "
                f"Expected {len(CLASS_NAMES)} values."
            )

        _model = model
        _class_names = class_names
        _model_img_size = _model.input_shape[1]
    return _model, _class_names

def preprocess_image(image_path: str) -> np.ndarray:
    """Load, resize, and normalize an image for inference."""
    img = Image.open(image_path).convert("RGB")
    img = img.resize((_model_img_size, _model_img_size))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr

def predict_image(image_path: str) -> dict:
    """
    Run inference on a single image.

    Returns a dict with keys:
        - class_name: predicted label (Safe / Warning / Dangerous)
        - confidence: float percentage (0-100)
        - risk_level: Low / Medium / High
        - prediction_time: seconds taken for inference
        - all_probabilities: dict of class -> probability
    """
    model, class_names = _load_model()
    arr = preprocess_image(image_path)

    start = time.time()
    preds = model.predict(arr, verbose=0)[0]
    elapsed = time.time() - start

    idx = int(np.argmax(preds))
    class_name = class_names[idx]
    confidence = float(preds[idx] * 100)
    all_probs = {class_names[i]: float(preds[i] * 100) for i in range(len(class_names))}

    return {
        "class_name": class_name,
        "confidence": round(confidence, 2),
        "risk_level": RISK_LEVELS.get(class_name, "Unknown"),
        "prediction_time": round(elapsed, 4),
        "all_probabilities": all_probs,
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)
    result = predict_image(sys.argv[1])
    print(json.dumps(result, indent=2))
