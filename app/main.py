from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Build
from app.coletor import buscar_builds_poe_ninja
from app.analise import analisar_meta
from app.models import MetaSnapshot
from app.analise import calcular_tendencias
from datetime import datetime, timedelta
import pandas as pd
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# Schema de entrada — valida o que chega na requisição
class BuildIn(BaseModel):
    nome: str
    classe: str
    ascendancy: str
    main_skill: str
    popularidade: float = 0.0
    hc_viable: bool = False

@app.get("/")
def home():
    return {"status": "ok", "mensagem": "ARPG Analyzer rodando!"}

@app.get("/builds")
def listar_builds(
    classe: str = None,
    hc_viable: bool = None,
    ordenar: str = "popularidade",
    db: Session = Depends(get_db)
):
    query = db.query(Build)

    if classe:
        query = query.filter(Build.classe == classe)

    if hc_viable is not None:
        query = query.filter(Build.hc_viable == hc_viable)

    if ordenar == "popularidade":
        query = query.order_by(Build.popularidade.desc())
    elif ordenar == "nome":
        query = query.order_by(Build.nome)

    return query.all()

@app.get("/builds/{id}")
def get_build(id: int, db: Session = Depends(get_db)):
    build = db.query(Build).filter(Build.id == id).first()
    if not build:
        raise HTTPException(status_code=404, detail="Build não encontrada")
    return build

@app.post("/builds")
def criar_build(dados: BuildIn, db: Session = Depends(get_db)):
    nova = Build(**dados.model_dump())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return nova

@app.delete("/builds/{id}")
def deletar_build(id: int, db: Session = Depends(get_db)):
    build = db.query(Build).filter(Build.id == id).first()
    if not build:
        raise HTTPException(status_code=404, detail="Build não encontrada")
    db.delete(build)
    db.commit()
    return {"mensagem": f"Build {id} deletada"}

@app.post("/coletar")
def coletar_builds(db: Session = Depends(get_db)):
    builds = buscar_builds_poe_ninja()
    inseridas = 0
    for b in builds:
        nova = Build(**b)
        db.add(nova)
        inseridas += 1
    db.commit()
    return {"mensagem": f"{inseridas} builds inseridas"}


@app.get("/meta")
def ver_meta(db: Session = Depends(get_db)):
    builds = db.query(Build).all()
    dados = [
        {
            "nome": b.nome,
            "classe": b.classe,
            "main_skill": b.main_skill,
            "popularidade": b.popularidade,
            "hc_viable": b.hc_viable,
        }
        for b in builds
    ]
    return analisar_meta(dados)

@app.post("/meta/snapshot")
def salvar_snapshot(db: Session = Depends(get_db)):
    builds = db.query(Build).all()
    dados = [{"classe": b.classe, "popularidade": b.popularidade} for b in builds]
    df = pd.DataFrame(dados)
    df = df[df["classe"] != "string"]

    total = df["popularidade"].sum()
    dist = (df.groupby("classe")["popularidade"].sum() / total * 100).round(1)

    ultima = db.query(MetaSnapshot).order_by(MetaSnapshot.rodada.desc()).first()
    proxima_rodada = (ultima.rodada + 1) if ultima else 1

    for classe, pct in dist.items():
        snap = MetaSnapshot(classe=classe, popularidade_pct=pct, rodada=proxima_rodada)
        db.add(snap)
    db.commit()
    return {"mensagem": f"Snapshot salvo — rodada {proxima_rodada}"}

@app.get("/meta/tendencias")
def ver_tendencias(db: Session = Depends(get_db)):
    todos = db.query(MetaSnapshot).filter(MetaSnapshot.classe != "string").order_by(MetaSnapshot.rodada).all()

    if not todos:
        return {"erro": "Nenhum snapshot. Chame POST /meta/snapshot primeiro."}

    rodadas = sorted(set(s.rodada for s in todos))

    if len(rodadas) < 2:
        return {"aviso": "Só uma rodada disponível — chame POST /meta/snapshot mais uma vez após mudar as builds."}

    rodada_atual   = rodadas[-1]
    rodada_anterior = rodadas[-2]

    hoje     = [{"classe": s.classe, "popularidade_pct": s.popularidade_pct} for s in todos if s.rodada == rodada_atual]
    anterior = [{"classe": s.classe, "popularidade_pct": s.popularidade_pct} for s in todos if s.rodada == rodada_anterior]

    return calcular_tendencias(hoje, anterior)

@app.get("/recomendar")
def recomendar(
    playstyle: str = "allrounder",
    classe: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Build)

    if classe:
        query = query.filter(Build.classe == classe)

    builds = query.all()

    if not builds:
        return {"erro": "Nenhuma build encontrada"}

    # Pesos por playstyle
    pesos = {
        "clearspeed": {"popularidade": 0.7, "hc": 0.0},
        "bossing":    {"popularidade": 0.4, "hc": 0.0},
        "hardcore":   {"popularidade": 0.3, "hc": 0.7},
        "allrounder": {"popularidade": 0.5, "hc": 0.5},
    }

    w = pesos.get(playstyle, pesos["allrounder"])
    max_pop = max(b.popularidade for b in builds)

    resultado = []
    for b in builds:
        score = (
            (b.popularidade / max_pop) * w["popularidade"] * 100 +
            (1.0 if b.hc_viable else 0.0) * w["hc"] * 100
        )
        motivos = []
        if b.popularidade >= max_pop * 0.8:
            motivos.append("Alta popularidade no meta")
        if b.hc_viable and playstyle == "hardcore":
            motivos.append("Viável em Hardcore")
        if playstyle == "clearspeed" and b.popularidade >= max_pop * 0.7:
            motivos.append("Boa para farm de mapas")
        if playstyle == "bossing":
            motivos.append("Considerada para bossing")

        resultado.append({
            "nome": b.nome,
            "classe": b.classe,
            "ascendancy": b.ascendancy,
            "main_skill": b.main_skill,
            "score": round(score, 1),
            "motivos": motivos,
            "hc_viable": b.hc_viable,
            "popularidade": b.popularidade,
        })

    resultado.sort(key=lambda x: x["score"], reverse=True)
    return resultado[:5]