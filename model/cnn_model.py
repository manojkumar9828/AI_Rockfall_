"""
CNN model architecture for Rockfall classification.

Classifies mine slope images into three risk classes:
Safe, Warning, Dangerous. Image input: 224x224 RGB, output: 3-class softmax.
"""
import json
from pathlib import Path

import tensorflow as tf  # type: ignore[import]
from tensorflow.keras import layers, models, optimizers  # type: ignore

IMG_SIZE = 224
NUM_CLASSES = 3
CLASS_NAMES = ["Safe", "Warning", "Dangerous"]

MODEL_DIR = Path(__file__).resolve().parent
MODEL_PATH = MODEL_DIR / "rockfall_model.h5"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"

def build_model(img_size: int = IMG_SIZE) -> tf.keras.Model:
    """Construct and return the CNN model architecture."""
    model = models.Sequential(
        [
            layers.Input(shape=(img_size, img_size, 3)),
            layers.Conv2D(16, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
            layers.MaxPooling2D((2, 2)),
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.3),
            layers.Dense(64, activation="relu"),
            layers.Dense(NUM_CLASSES, activation="softmax"),
        ],
        name="rockfall_cnn",
    )
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model

def save_class_names() -> None:
    """Persist class names to JSON for use at inference time."""
    CLASS_NAMES_PATH.write_text(json.dumps(CLASS_NAMES, indent=2))

def load_class_names() -> list:
    """Load class names from JSON."""
    return json.loads(CLASS_NAMES_PATH.read_text())

if __name__ == "__main__":
    m = build_model()
    m.summary()
    save_class_names()
    print(f"Class names saved to {CLASS_NAMES_PATH}")
