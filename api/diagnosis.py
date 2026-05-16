# diagnosis.py  — run this in your malenoma_env
import tensorflow as tf
import keras
import keras.layers as kl

print("=== VERSION INFO ===")
print(f"TF:    {tf.__version__}")
print(f"Keras: {keras.__version__}")

print("\n=== RandomFlip signature ===")
import inspect
print(inspect.signature(kl.RandomFlip.__init__))

print("\n=== RandomRotation signature ===")
print(inspect.signature(kl.RandomRotation.__init__))

print("\n=== RandomBrightness signature ===")
print(inspect.signature(kl.RandomBrightness.__init__))

print("\n=== Attempt raw load (no custom_objects) ===")
try:
    m = keras.saving.load_model("saved_model/best_fusion_model.keras", compile=False)
    print("SUCCESS — no patch needed")
except Exception as e:
    print(f"FAILED: {e}")

print("\n=== Attempt load with SafeRandomFlip patch ===")
class SafeRandomFlip(kl.RandomFlip):
    def __init__(self, *args, **kwargs):
        kwargs.pop("data_format", None)
        super().__init__(*args, **kwargs)

try:
    m = keras.saving.load_model(
        "saved_model/best_fusion_model.keras",
        custom_objects={"RandomFlip": SafeRandomFlip},
        compile=False
    )
    print("SUCCESS with SafeRandomFlip patch")
except Exception as e:
    print(f"FAILED: {e}")

print("\n=== Attempt load with full augmentation patch ===")
class SafeRandomRotation(kl.RandomRotation):
    def __init__(self, *args, **kwargs):
        kwargs.pop("data_format", None)
        super().__init__(*args, **kwargs)

class SafeRandomBrightness(kl.RandomBrightness):
    def __init__(self, *args, **kwargs):
        kwargs.pop("data_format", None)
        super().__init__(*args, **kwargs)

try:
    m = keras.saving.load_model(
        "saved_model/best_fusion_model.keras",
        custom_objects={
            "RandomFlip": SafeRandomFlip,
            "RandomRotation": SafeRandomRotation,
            "RandomBrightness": SafeRandomBrightness,
        },
        compile=False
    )
    print("SUCCESS with full augmentation patch")
except Exception as e:
    print(f"FAILED: {e}")