# YePAI Climbing Grade Predictor API

This is the backend API for the YePAI Climbing app that predicts climbing grades from route images.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the API

To start the API server:

```
python main.py
```

This will start the server at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the auto-generated API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### POST /api/upload

Predicts the climbing grade based on an image URL and hold color.

**Request Body:**

```json
{
  "image_url": "https://example.com/image.jpg",
  "hold_color": "red"
}
```

**Response:**

```json
{
  "grade": "5.10a",
  "confidence": 0.85
}
```

## Development

This is currently a placeholder implementation that returns random grades. 
The actual machine learning model will be implemented in the future.

## Integration with Frontend

The frontend communicates with this API by sending the Supabase Storage URL of the uploaded image
and the selected hold color. The API then returns a predicted grade which is stored in the database. 