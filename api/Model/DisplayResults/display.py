from ultralytics import YOLO
import matplotlib.pyplot as plt

model = YOLO("/Users/edgaryepez/Developer/Projects/yepai-climbs/Model/Pytrochfiles/colorbest.pt")

results = model.predict("/Users/edgaryepez/Developer/Projects/yepai-climbs/Model/Datasets/HoldColor/AutoBouldering.v3i.yolov8/train/images/IMG_2441_jpeg_jpg.rf.1fc8f3250624b0096e77d9ef16a8926b.jpg")


result = results[0]

len(result.boxes)
box = result.boxes[0]

for box in result.boxes:
  class_id = result.names[box.cls[0].item()]
  cords = box.xyxy[0].tolist()
  cords = [round(x) for x in cords]
  conf = round(box.conf[0].item(), 2)
  print("Object type:", class_id)
  print("Coordinates:", cords)
  print("Probability:", conf)
  print("---")


img_with_boxes = result.plot()

# Display using matplotlib
plt.figure(figsize=(12, 8))
plt.imshow(img_with_boxes)
plt.axis("off")
plt.title("YOLOv8 Predictions")
plt.show()