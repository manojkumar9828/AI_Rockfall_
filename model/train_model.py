"""
Training script for the Rockfall CNN model.

Reads images from dataset/<class_name>/ folders, applies augmentation,
trains the CNN, and saves the trained model to model/rockfall_model.h5
along with class_names.json.

Usage:
    python model/train_model.py
"""
import sys
from pathlib import Path
from typing import List

import numpy as np
import tensorflow as tf  # type: ignore[import]
from tensorflow.keras import layers  # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator  # type: ignore

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cnn_model import build_model, save_class_names, IMG_SIZE, CLASS_NAMES, MODEL_PATH  # noqa: E402

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset"
BATCH_SIZE = 32
EPOCHS = 30
ALLOWED_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
EXPECTED_CLASS_DIRS = [DATASET_DIR / class_name for class_name in CLASS_NAMES]

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

def _is_image_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in ALLOWED_IMAGE_EXTENSIONS


def _count_images(folder: Path) -> int:
    return sum(1 for path in folder.iterdir() if _is_image_file(path))


def validate_dataset_structure() -> None:
    errors: list[str] = []
    if not DATASET_DIR.exists():
        errors.append(f"Dataset folder not found: {DATASET_DIR}")
    elif not DATASET_DIR.is_dir():
        errors.append(f"Dataset path is not a directory: {DATASET_DIR}")
    else:
        unexpected_files = [p.name for p in DATASET_DIR.iterdir() if p.is_file()]
        if unexpected_files:
            errors.append(
                "Unexpected files found in the dataset root: "
                + ", ".join(unexpected_files)
                + ". Remove or relocate them into class folders."
            )

        present_dirs = {p.name for p in DATASET_DIR.iterdir() if p.is_dir()}
        missing_dirs = [name for name in CLASS_NAMES if name not in present_dirs]
        if missing_dirs:
            errors.append("Missing class folders: " + ", ".join(missing_dirs))

        for class_name in CLASS_NAMES:
            class_dir = DATASET_DIR / class_name
            if class_dir.exists() and class_dir.is_dir():
                image_count = _count_images(class_dir)
                if image_count == 0:
                    errors.append(
                        f"No image files found in {class_dir}. "
                        "Add .png/.jpg/.jpeg images to this folder."
                    )

    if errors:
        print("[ERROR] Invalid dataset structure detected.")
        for message in errors:
            print("  -", message)
        print("Please organize your training images into:")
        print("  dataset/Safe/  dataset/Warning/  dataset/Dangerous/")
        sys.exit(1)

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
    validate_dataset_structure()

    model = build_model()
    aug = build_augmentation()
    train_gen, val_gen = load_data(aug)

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6),
    ]

    history = model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS, callbacks=callbacks, verbose=1)

    model.save(MODEL_PATH)
    save_class_names()
    print(f"\nModel saved to {MODEL_PATH}")

    hist_path = MODEL_PATH.parent / "training_history.json"
    import json
    hist_path.write_text(json.dumps(history.history, indent=2))
    print(f"Training history saved to {hist_path}")
    return history

if __name__ == "__main__":
    train()
