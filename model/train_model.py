"""
Training script for the Rockfall CNN model.

Reads images from dataset/<class_name>/ folders, applies augmentation, trains
the CNN defined in cnn_model.py, and saves the trained model to
model/rockfall_model.h5 along with class_names.json.

Usage:
    python model/train_model.py
"""
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers  # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator  # type: ignore

# Allow importing cnn_model when run as a script
sys.path.insert(0, str(Path(__file__).resolve().parent))
from cnn_model import build_model, save_class_names, IMG_SIZE, CLASS_NAMES, MODEL_PATH  # noqa: E402

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset"
BATCH_SIZE = 32
EPOCHS = 30


def build_augmentation() -> ImageDataGenerator:
    """Create an ImageDataGenerator with augmentation + 20% validation split."""
    return ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        horizontal_flip=True,
        zoom_range=0.15,
        shear_range=0.1,
        fill_mode="nearest",
        validation_split=0.2,
    )


def load_data(aug: ImageDataGenerator):
    """Load training and validation generators from the dataset folder."""
    train_gen = aug.flow_from_directory(
        str(DATASET_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        classes=CLASS_NAMES,
        seed=42,
    )
    val_gen = aug.flow_from_directory(
        str(DATASET_DIR),
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        classes=CLASS_NAMES,
        seed=42,
    )
    return train_gen, val_gen


def train():
    """Build, train, and save the model."""
    if not DATASET_DIR.exists() or not any(DATASET_DIR.iterdir()):
        print(f"[ERROR] Dataset directory not found or empty: {DATASET_DIR}")
        print("Please organize images into dataset/Safe, dataset/Warning, dataset/Dangerous")
        sys.exit(1)

    model = build_model()
    aug = build_augmentation()
    train_gen, val_gen = load_data(aug)

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6
        ),
    ]

    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1,
    )

    model.save(MODEL_PATH)
    save_class_names()
    print(f"\nModel saved to {MODEL_PATH}")

    # Save training history for plotting accuracy/loss graphs
    hist_path = MODEL_PATH.parent / "training_history.json"
    import json
    hist_path.write_text(json.dumps(history.history, indent=2))
    print(f"Training history saved to {hist_path}")
    return history


if __name__ == "__main__":
    train()
