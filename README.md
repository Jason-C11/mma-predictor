# MMA Predictor

A small web application to predict MMA fight outcomes using Python and machine learning, with a FastAPI backend and a Next.js/TypeScript frontend.

---

## Project Structure
```
mma-predictor/
├─ backend/ # Python backend with FastAPI and ML code
├─ frontend/ # Next.js frontend with Material-UI
├─ data/ # Datasets (Source: https://github.com/Greco1899/scrape_ufc_stats)
└─ README.md
```

---
## Tech Stack

**Backend (Python / ML / API):**  
- **FastAPI** – Web framework for building APIs  
- **MongoDB / PyMongo** – NoSQL database for storing fight and fighter data  
- **TensorFlow, Keras, LightGBM, XGBoost, scikit-learn** – Machine learning libraries for fight prediction models  
- **NumPy, Pandas, SciPy** – Data manipulation and analysis  
- **Uvicorn** – ASGI server for running FastAPI  


**Frontend (Next.js / React / TypeScript):**  
- **Next.js** – React framework for server-side rendering and routing  
- **React + React DOM** – Frontend UI library  
- **Material-UI (MUI)** – Component library for styling and UI  
- **Emotion** – CSS-in-JS styling solution  
- **React Query (@tanstack/react-query)** – Data fetching and caching  
- **Axios** – HTTP client for API requests  
- **TypeScript** – Type-safe JavaScript  


---

## Getting Started

### Backend

#### 1. Navigate to the backend folder:
```bash
cd mma-predictor/backend
```

#### 2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

#### 3. Install dependencies:
```bash
pip install -r requirements.txt
```

#### 4. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```
---
### Frontend

#### 1. Navigate to the frontend folder:
```bash
cd mma-predictor/frontend
```
#### 2. Install dependencies: 
```bash
npm install
```
#### 3. Run the development server:
```bash
npm run dev
```
### Usage
Open [http://localhost:3000](http://localhost:3000) in your browser


Use the frontend to navigate between Predict a Fight, Fighter Stats and Fight History.

## Data Source

Data gathered from: [https://github.com/Greco1899/scrape_ufc_stats](https://github.com/Greco1899/scrape_ufc_stats)



