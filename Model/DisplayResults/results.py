from ultralytics import YOLO
from PIL import Image
import os
import json
from collections import defaultdict
import re  # for filename parsing
import cv2
import numpy as np

# Load models
color_model = YOLO("Model/Pytrochfiles/colorbestv1.pt")
type_model = YOLO("Model/Pytrochfiles/holdsbestv2.pt")

# Folder of climbing wall images
image_folder = "Model/Datasets/stonecov1"  # <-- change this to your actual folder path
output_json_path = "Model/JsonRoutes/stoneco_all_routesv1.json"

# Image extensions allowed
image_extensions = (".jpg", ".jpeg", ".png")

# Final data for all images
all_routes = []

# Helper to parse filename like 'orange_V4.jpg' or 'pink_V5_1.jpg'
def parse_filename(filename):
    name = os.path.splitext(filename)[0]  # remove extension
    match = re.match(r"(?P<color>\w+)_V(?P<grade>\d+)(?:-\d+)?$", name)
    if match:
        return match.group("color"), f"V{match.group('grade')}"
    else:
        return None, None


# Loop through each image
for img_name in os.listdir(image_folder):
    if not img_name.lower().endswith(image_extensions):
        continue

    img_path = os.path.join(image_folder, img_name)
    image_id = os.path.splitext(img_name)[0]  # for route_id
    image = Image.open(img_path).convert("RGB")

    # Extract target color and grade from filename
    target_color, grade = parse_filename(img_name)
    if not target_color or not grade:
        print(f"⚠️ Skipping: could not parse color/grade from {img_name}")
        continue

    # Folder to save visual results
    results_folder = "Model/results"
    os.makedirs(results_folder, exist_ok=True)

    # Step 1: Detect hold color
    results = color_model.predict(img_path)
    result = results[0]

    # Load image as array for drawing
    img_array = np.array(image.copy())

    # Draw only boxes for the target color
    for box in result.boxes:
        class_id = int(box.cls[0])
        color_label = result.names[class_id]
        if color_label != target_color:
            continue

        coords = [int(x) for x in box.xyxy[0].tolist()]
        x1, y1, x2, y2 = coords

        # Draw rectangle (BGR color, thickness)
        cv2.rectangle(img_array, (x1, y1), (x2, y2), (0, 255, 0), 3)
        cv2.putText(img_array, color_label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # Save result image with only target color boxes
    save_path = os.path.join(results_folder, f"v1/{image_id}_color_result.jpg")
    Image.fromarray(img_array).save(save_path)

    # Group holds by color
    routes = defaultdict(list)
    temp_folder = "Model/temp"
    os.makedirs(temp_folder, exist_ok=True)

    for i, box in enumerate(result.boxes):
        coords = [round(x) for x in box.xyxy[0].tolist()]
        x1, y1, x2, y2 = coords
        color = result.names[int(box.cls[0])]

        # Crop and classify hold type
        crop = image.crop((x1, y1, x2, y2))
        temp_crop_path = f"{temp_folder}/temp_crop_{i}.jpg"
        crop.save(temp_crop_path)

        type_result = type_model.predict(temp_crop_path)[0]
        if len(type_result.boxes) == 0:
            hold_type = "unknown"
        else:
            type_label = int(type_result.boxes[0].cls[0])
            hold_type = type_result.names[type_label]

        # Calculate hold size from bounding box dimensions
        hold_width = x2 - x1
        hold_height = y2 - y1
        # Optionally, you can compute area: hold_area = hold_width * hold_height

        # Center coordinates
        center_x = round((x1 + x2) / 2)
        center_y = round((y1 + y2) / 2)

        # Add hold data to color group, including size info
        routes[color].append({
            "x": center_x,
            "y": center_y,
            "type": hold_type,
            "width": hold_width,
            "height": hold_height
            # "area": hold_area  # Uncomment if you want to include area
        })

    wall_width, wall_height = image.size

    if target_color in routes:
        holds = routes[target_color]
        route = {
            "route_id": f"{image_id}_{target_color}",
            "image": img_name,
            "wall_width": wall_width,
            "wall_height": wall_height,
            "num_holds": len(holds),
            "holds": holds,
            "grade": grade  # add grade from filename
        }
        all_routes.append(route)
    else:
        print(f"⚠️ No holds found for color '{target_color}' in {img_name}")

# Save all route data to one JSON file
with open(output_json_path, "w") as f:
    json.dump(all_routes, f, indent=2)

print(f"✅ Saved {len(all_routes)} routes from {image_folder} to {output_json_path}")
