from fastapi import APIRouter


router = APIRouter(
    prefix="/relatorios",
    tags=["Relatórios"]
)


@router.get("/")
def listar_relatorios():

    return {
        "message": "Router relatórios funcionando"
    }
