from fastapi import APIRouter


router = APIRouter(
    prefix="/documentos",
    tags=["Documentos"]
)


@router.get("/")
def listar_documentos():

    return {
        "message": "Router documentos funcionando"
    }
