import os
from pathlib import Path

from dotenv import load_dotenv

APP_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = APP_DIR.parent.parent

ENV_FILES = (
  PROJECT_ROOT / ".env",
  PROJECT_ROOT / "Backend" / ".env",
  PROJECT_ROOT / "Docs" / "infs.env",
)

for env_file in ENV_FILES:
  if env_file.exists():
    load_dotenv(dotenv_path=env_file, override=False)

DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_PUBLISHABLE_KEY = (
  os.getenv("SUPABASE_PUBLISHABLE_KEY")
  or os.getenv("SUPABASE_KEY")
  or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")
  or os.getenv("VITE_SUPABASE_KEY")
)

if not DATABASE_URL:
  raise RuntimeError("DATABASE_URL não foi encontrada em nenhum arquivo de ambiente.")

DEFAULT_FRONTEND_ORIGINS = (
  "http://localhost:5173",
  "http://127.0.0.1:5173",
)

frontend_origins_env = os.getenv("FRONTEND_ORIGINS")

if frontend_origins_env:
  FRONTEND_ORIGINS = [
    origin.strip()
    for origin in frontend_origins_env.split(",")
    if origin.strip()
  ]
else:
  FRONTEND_ORIGINS = list(DEFAULT_FRONTEND_ORIGINS)
