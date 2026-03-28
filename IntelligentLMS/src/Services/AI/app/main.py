from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api import recommend_routes, learning_path_routes, dropout_routes
from app.kafka.consumer import start_consumer_thread, stop_consumer_thread

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Events
    print("Starting ML AI Service...")
    consumer_thread = start_consumer_thread()
    # If ML models are completely missing, we could auto-train them.
    # We will rely on background script or real time updates for now.
    
    yield
    
    # Shutdown Events
    print("Shutting down AI Service...")
    stop_consumer_thread()
    if consumer_thread:
        consumer_thread.join(timeout=5)


app = FastAPI(title="Intelligent LMS - AI Service", version="1.0.0", lifespan=lifespan)

# Register routes
app.include_router(recommend_routes.router)
app.include_router(learning_path_routes.router)
app.include_router(dropout_routes.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    # Typically launch via 'uvicorn app.main:app --host 0.0.0.0 --port 8000'
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
