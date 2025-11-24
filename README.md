# MMA Predictor

A small web application to predict MMA fight outcomes using Python and machine learning, with a FastAPI backend and a Next.js/TypeScript frontend.



## Project Structure
```
mma-predictor/
├─ backend/ # Python backend with FastAPI and ML code
├─ frontend/ # Next.js frontend with Material-UI
├─ data/ # Datasets (Source: see Data Source)
└─ README.md
```


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



## Model Training

The fight prediction models were trained using [historical UFC fight data](https://github.com/Greco1899/scrape_ufc_stats),
including both fight outcomes and detailed round-by-round fighter statistics. The raw data was first cleaned and standardized: numeric stats were parsed, time and percentage values converted to seconds and fractions, and textual data normalized. Round-level stats were then aggregated per fighter, and accuracy features (e.g., significant strike and takedown accuracy) were computed, producing overall fight-level statistics for each fighter.

To prepare the training dataset, each fight was represented as a single row with fighter1 vs. fighter2 stats and stat difference columns (fighter1 − fighter2) to capture relative performance. The target variable indicates whether fighter1 won the fight.

The dataset was split into 80% training and 20% test sets, stratified by the target to maintain class balance. To address class imbalance, RandomOverSampler was applied to the training set. Additionally, the dataset was augmented by swapping fighter1 and fighter2 stats, with the target inverted, effectively doubling the training data and improving model robustness.

Three ensemble classifiers were trained on the augmented data: Random Forest, XGBoost, and LightGBM. Each model used hyperparameter tuning such as tree depth, number of estimators, and regularization to optimize performance. Finally, the trained models were saved using joblib for inference by the FastAPI backend.



## Data Source

Data gathered from: [https://github.com/Greco1899/scrape_ufc_stats](https://github.com/Greco1899/scrape_ufc_stats)

## Feature Engineering
The prediction models use a combination of raw fighter statistics and derived features to capture relative performance in each fight. Key steps in feature engineering include:


#### 1. Aggregating round-level stats:
* Round-by-round fighter stats (e.g., strikes landed, takedowns, control time) were summed to compute overall fight-level statistics per fighter.
* Accuracy metrics such as significant strike accuracy and takedown accuracy were calculated from landed vs. attempted actions.

#### 2. Creating fighter pair features:
* Each fight is represented by fighter1 vs. fighter2 stats.
* Difference columns (fighter1 − fighter2) were computed for each numeric feature to capture relative advantage in strikes, takedowns, knockdowns, submissions, and control time.

#### 3. Target variable:
* fighter1_win indicates whether fighter1 won (1 = win, 0 = loss).

#### 4. Data augmentation:
* The training dataset was doubled by swapping fighter1 and fighter2 stats and inverting the target variable. This improves model generalization.

#### 5. Per-fight career averages:
* All features represent a fighter’s average statistics per fight, over their recorded UFC fights, rather than a single fight or most recent fights. 
* This may not always capture variability in performance or recent form.

#### Main features include:

* Striking: significant strikes landed/attempted, total strikes landed/attempted, head/body/leg/distance/clinch/ground strikes landed, knockdowns.

* Grappling/control: takedowns landed/attempted, submission attempts, reversals, control time (seconds).

* Accuracy: significant strike accuracy, takedown accuracy.



## Future Improvements / Features
* Improved model accuracy: Address current limitations, including the fact that the model uses per-fight average statistics, which may not fully capture a fighter’s typical performance or variability between fights.

* Enhanced feature set: Incorporate additional fighter attributes such as age, reach, stance, and historical performance trends to better account for stylistic differences and physical advantages.

* Expanded model repertoire: Explore other machine learning approaches beyond ensemble classifiers, including neural networks, gradient boosting variants, and support vector machines, to improve prediction robustness.

* Real-time data integration: Update fight statistics and fighter profiles automatically to keep predictions current.

* User experience enhancements: Add more interactive visualizations on the frontend to compare fighters’ statistics, trends, and predicted outcomes.



