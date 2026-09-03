
from model import Base
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DBNAME = os.getenv("DBNAME")

DATABASE_URL = (
    f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
    "?sslmode=require"
)

engine = create_engine(DATABASE_URL)


# ---------------------------------------------------

Base.metadata.create_all(bind=engine)
# print("Database tables created successfully.")
 
# create_all() only creates tables that don't exist yet — it never adds
# columns to a table that's already there. The `moodboards` table pre-dates
# the `images` column on the Moodboard model, so it's missing in the
# database. Add it here, idempotently, without touching the table or its
# existing rows otherwise.
with engine.begin() as conn:
    conn.execute(text(
        "ALTER TABLE moodboards "
        "ADD COLUMN IF NOT EXISTS images JSON NOT NULL DEFAULT '[]'::json"
    ))
 
# `links` pre-dates the `category` column on the LinkItem model
    # (Column(String(20), nullable=False, default="notice")). Same situation
    # as above: add it without touching the table or existing rows.
    # Default 'notice' preserves all existing rows as Board/Notice links.
    conn.execute(text(
        "ALTER TABLE links "
        "ADD COLUMN IF NOT EXISTS category VARCHAR(20) NOT NULL DEFAULT 'notice'"
    ))