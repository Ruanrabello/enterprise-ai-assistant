from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def ensure_auth_schema(engine: Engine) -> None:
  """Adiciona a identidade do Supabase sem apagar os dados locais existentes."""
  inspector = inspect(engine)

  if "usuarios" not in inspector.get_table_names():
    return

  columns = {column["name"] for column in inspector.get_columns("usuarios")}

  with engine.begin() as connection:
    if "supabase_id" not in columns:
      connection.execute(text("ALTER TABLE usuarios ADD COLUMN supabase_id VARCHAR"))

    connection.execute(
      text(
        "CREATE UNIQUE INDEX IF NOT EXISTS ix_usuarios_supabase_id "
        "ON usuarios (supabase_id)"
      )
    )
