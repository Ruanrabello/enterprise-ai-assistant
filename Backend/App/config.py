import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, "..", "..", "Docs", "infs.env")
load_dotenv(dotenv_path=env_path)

try:
    DATABASE_URL: str = os.environ["DATABASE_URL"]
except KeyError:
    raise Exception("DATABASE_URL não foi encontrada no arquivo .env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
