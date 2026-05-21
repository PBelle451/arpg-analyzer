import pandas as pd
from datetime import datetime, timedelta


def analisar_meta(builds: list) -> dict:
    df = pd.DataFrame(builds)

    # Distribuição por classe
    classe_dist = (
        df.groupby("classe")["popularidade"]
        .sum()
        .sort_values(ascending=False)
    )
    total = classe_dist.sum()
    classe_pct = (classe_dist / total * 100).round(1).to_dict()

    # Top 5 skills mais populares
    top_skills = (
        df.sort_values("popularidade", ascending=False)
        .head(5)[["nome", "main_skill", "classe", "popularidade"]]
        .to_dict(orient="records")
    )

    # Percentual de builds HC viable
    hc_pct = round(df["hc_viable"].mean() * 100, 1)

    # Diversidade — quantas classes diferentes no meta
    n_classes = df["classe"].nunique()

    return {
        "total_builds": len(df),
        "distribuicao_classes": classe_pct,
        "top_skills": top_skills,
        "hc_viable_pct": hc_pct,
        "classes_no_meta": n_classes,
    }

def calcular_tendencias(snapshots_hoje: list, snapshots_ontem: list) -> list:
    hoje = {s["classe"]: s["popularidade_pct"] for s in snapshots_hoje}
    ontem = {s["classe"]: s["popularidade_pct"] for s in snapshots_ontem}

    tendencias = []
    for classe, pct_hoje in hoje.items():
        pct_ontem = ontem.get(classe, pct_hoje)
        variacao = round(pct_hoje - pct_ontem, 1)

        if variacao > 1:
            direcao = "subindo"
        elif variacao < -1:
            direcao = "caindo"
        else:
            direcao = "estavel"

        tendencias.append({
            "classe": classe,
            "hoje": pct_hoje,
            "ontem": pct_ontem,
            "variacao": variacao,
            "direcao": direcao,
        })

    return sorted(tendencias, key=lambda x: x["variacao"], reverse=True)