from fastapi import APIRouter, Depends

from core.auth import get_current_user
from database.models.Usuario import Usuario


router = APIRouter(
    prefix="/relatorios",
    tags=["Relatórios"]
)


@router.get("/")
def listar_relatorios(_usuario: Usuario = Depends(get_current_user)):

    return {
        "message": "Router relatórios funcionando"
    }
