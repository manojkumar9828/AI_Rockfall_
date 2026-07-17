"""
Generate a trained model using synthetic data.

Creates a small synthetic dataset of procedural images representing mine slope
textures for each class (Safe, Warning, Dangerous), trains the CNN, and saves
the model to model/rockfall_model.h5. This lets the project run end-to-end
without requiring a real rockfall image dataset.

Usage:
    python model/generate_model.py
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cnn_model import build_model, save_class_names, IMG_SIZE, CLASS_NAMES, MODEL_PATH  # noqa: E402

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset"
SAMPLES_PER_CLASS = 30  # small synthetic set
TRAIN_IMG_SIZE = 64     # reduced for memory-constrained training


def make_synthetic_image(label: str, idx: int) -> Image.Image:
    """Generate a procedural image approximating mine slope textures."""
    rng = np.random.default_rng(seed=hash(label + str(idx)) & 0xFFFFFFFF)
    img = Image.new("RGB", (IMG_SIZE, IMG_SIZE))
    draw = ImageDraw.Draw(img)

    if label == "Safe":
        # Stable rock - mostly gray-brown, smooth, few cracks
        base = tuple(int(rng.integers(90, 130)) for _ in range(3))
        draw.rectangle([0, 0, IMG_SIZE, IMG_SIZE], fill=base)
        for _ in range(30):
            x, y = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            shade = int(rng.integers(-15, 15))
            c = tuple(max(0, min(255, v + shade)) for v in base)
            r = int(rng.integers(3, 12))
            draw.ellipse([x - r, y - r, x + r, y + r], fill=c)
        # very few thin cracks
        for _ in range(2):
            x1, y1 = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            x2, y2 = x1 + int(rng.integers(-20, 20)), y1 + int(rng.integers(20, 60))
            draw.line([x1, y1, x2, y2], fill=(50, 50, 50), width=1)

    elif label == "Warning":
        # Some cracks and loose rocks - brownish with visible fractures
        base = (120, 100, 80)
        draw.rectangle([0, 0, IMG_SIZE, IMG_SIZE], fill=base)
        for _ in range(50):
            x, y = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            shade = int(rng.integers(-25, 25))
            c = tuple(max(0, min(255, v + shade)) for v in base)
            r = int(rng.integers(2, 10))
            draw.ellipse([x - r, y - r, x + r, y + r], fill=c)
        # moderate cracks
        for _ in range(8):
            x1, y1 = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            x2, y2 = x1 + int(rng.integers(-40, 40)), y1 + int(rng.integers(30, 100))
            draw.line([x1, y1, x2, y2], fill=(40, 30, 20), width=2)

    else:  # Dangerous
        # Heavy fracturing, unstable slope - dark with many deep cracks
        base = (70, 55, 45)
        draw.rectangle([0, 0, IMG_SIZE, IMG_SIZE], fill=base)
        for _ in range(80):
            x, y = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            shade = int(rng.integers(-30, 15))
            c = tuple(max(0, min(255, v + shade)) for v in base)
            r = int(rng.integers(2, 8))
            draw.ellipse([x - r, y - r, x + r, y + r], fill=c)
        # many deep cracks
        for _ in range(20):
            x1, y1 = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            x2, y2 = x1 + int(rng.integers(-60, 60)), y1 + int(rng.integers(40, 120))
            draw.line([x1, y1, x2, y2], fill=(20, 15, 10), width=3)
        # loose boulders
        for _ in range(6):
            x, y = int(rng.integers(0, IMG_SIZE)), int(rng.integers(0, IMG_SIZE))
            r = int(rng.integers(8, 18))
            draw.ellipse([x - r, y - r, x + r, y + r], fill=(90, 75, 60))

    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    return img


def generate_dataset():
    """Create the synthetic dataset folders and images."""
    for label in CLASS_NAMES:
        class_dir = DATASET_DIR / label
        class_dir.mkdir(parents=True, exist_ok=True)
        for i in range(SAMPLES_PER_CLASS):
            img = make_synthetic_image(label, i)
            img.save(class_dir / f"{label.lower()}_{i:03d}.png")
    print(f"Synthetic dataset generated at {DATASET_DIR}")


def train_on_synthetic():
    """Train the CNN on the synthetic dataset."""
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import ImageDataGenerator  # type: ignore

    aug = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        zoom_range=0.1,
        validation_split=0.2,
    )
    train_gen = aug.flow_from_directory(
        str(DATASET_DIR),
        target_size=(TRAIN_IMG_SIZE, TRAIN_IMG_SIZE),
        batch_size=4,
        class_mode="categorical",
        subset="training",
        classes=CLASS_NAMES,
        seed=42,
    )
    val_gen = aug.flow_from_directory(
        str(DATASET_DIR),
        target_size=(TRAIN_IMG_SIZE, TRAIN_IMG_SIZE),
        batch_size=4,
        class_mode="categorical",
        subset="validation",
        classes=CLASS_NAMES,
        seed=42,
    )
    model = build_model(img_size=TRAIN_IMG_SIZE)
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=8,
        verbose=1,
    )
    model.save(MODEL_PATH)
    save_class_names()
    hist_path = MODEL_PATH.parent / "training_history.json"
    hist_path.write_text(json.dumps(history.history, indent=2))
    print(f"\nModel trained and saved to {MODEL_PATH}")
    print(f"Training history saved to {hist_path}")


if __name__ == "__main__":
    generate_dataset()
    train_on_synthetic()
