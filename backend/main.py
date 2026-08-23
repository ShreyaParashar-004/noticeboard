from fastapi import FastAPI
from routers.health import router as health_router
from routers.users import router as users_router
from routers.posts import router as posts_router
from routers import comments
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router)
app.include_router(health_router)
app.include_router(posts_router)
app.include_router(comments.router)