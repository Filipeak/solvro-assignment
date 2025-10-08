import os
import kagglehub
import cv2


# DATA LOADING

path = kagglehub.dataset_download(
    "gergvincze/simple-hand-drawn-and-digitized-images")
print("Path to dataset files:", path)

images = []

for (root, dirs, files) in os.walk(path):
    label = root.split("\\")[-1]

    for f in files:
        img = cv2.imread(root + "\\" + f, cv2.IMREAD_GRAYSCALE)
        images.append((label, img))

print("Number of images read:", len(images))

unique_labels = set([label for label, img in images])
print("Number of unique labels:", len(unique_labels))

for l in unique_labels:
    count = len([1 for label, img in images if label == l])
    print(f"  Label: {l}, Count: {count}")


# PREPROCESSING

for i in range(len(images)):
    label, img = images[i]

    img = img / 255.0

    images[i] = (label, img)


# MODEL TRAINING
