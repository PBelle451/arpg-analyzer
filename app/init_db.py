from app.database import engine, Base
from app.models import Build
from sqlalchemy.orm import Session

# Cria a tabela no banco
Base.metadata.create_all(engine)

# Insere builds de exemplo
with Session(engine) as db:
    builds = [
        Build(nome="Ball Lightning Witch", classe="Witch", ascendancy="Infernalist", main_skill="Ball Lightning", popularidade=12.4, hc_viable=False),
        Build(nome="Explosive Concoction", classe="Ranger", ascendancy="Deadeye",    main_skill="Explosive Concoction", popularidade=9.8, hc_viable=True),
        Build(nome="Bonestorm Invoker",    classe="Monk",   ascendancy="Invoker",     main_skill="Bonestorm", popularidade=7.9, hc_viable=True),
    ]
    db.add_all(builds)
    db.commit()
    print("Banco criado e dados inseridos!")