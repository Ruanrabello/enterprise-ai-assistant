from fastapi import APIRouter, Depends

from core.auth import get_current_user
from database.models.Usuario import Usuario


router = APIRouter(
    prefix="/documentos",
    tags=["Documentos"]
)


@router.get("/")
def listar_documentos(_usuario: Usuario = Depends(get_current_user)):

    return {
        "message": "Router documentos funcionando"
    }
