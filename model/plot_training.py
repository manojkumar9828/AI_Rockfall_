"""
Plot training accuracy and loss graphs from the saved training history.

Usage:
    python model/plot_training.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cnn_model import MODEL_PATH  # noqa: E402

HIST_PATH = MODEL_PATH.parent / "training_history.json"
OUT_DIR = MODEL_PATH.parent.parent / "static" / "images"


def plot():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    if not HIST_PATH.exists():
        print(f"[ERROR] Training history not found: {HIST_PATH}")
        print("Run model/train_model.py or model/generate_model.py first.")
        sys.exit(1)

    history = json.loads(HIST_PATH.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Accuracy graph
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(history["accuracy"], label="Training Accuracy", color="#FFC107", linewidth=2)
    ax.plot(history["val_accuracy"], label="Validation Accuracy", color="#FF6F00", linewidth=2)
    ax.set_title("Training & Validation Accuracy", fontsize=14, color="white")
    ax.set_xlabel("Epoch")
    ax.set_ylabel("Accuracy")
    ax.legend()
    ax.grid(True, alpha=0.3)
    fig.patch.set_facecolor("#1a1a1a")
    ax.set_facecolor("#2a2a2a")
    ax.tick_params(colors="white")
    for spine in ax.spines.values():
        spine.set_color("#555")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "training_accuracy.png", dpi=120)
    plt.close(fig)
    print(f"Saved {OUT_DIR / 'training_accuracy.png'}")

    # Loss graph
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(history["loss"], label="Training Loss", color="#FFC107", linewidth=2)
    ax.plot(history["val_loss"], label="Validation Loss", color="#FF6F00", linewidth=2)
    ax.set_title("Training & Validation Loss", fontsize=14, color="white")
    ax.set_xlabel("Epoch")
    ax.set_ylabel("Loss")
    ax.legend()
    ax.grid(True, alpha=0.3)
    fig.patch.set_facecolor("#1a1a1a")
    ax.set_facecolor("#2a2a2a")
    ax.tick_params(colors="white")
    for spine in ax.spines.values():
        spine.set_color("#555")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "training_loss.png", dpi=120)
    plt.close(fig)
    print(f"Saved {OUT_DIR / 'training_loss.png'}")


if __name__ == "__main__":
    plot()
