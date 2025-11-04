from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.fighter_routes import router as fighter_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Fight Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(fighter_router)
