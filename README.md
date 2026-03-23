# Inventário Híbrido — README Técnico

## 📦 Visão Geral
Sistema completo para gestão de inventários no varejo, com coleta offline, processamento local e análise inteligente.

## 🧱 Estrutura do Projeto
- **Mobile (Android)** — coleta offline, leitura de código de barras, geração de retorno.
- **Desktop (Windows)** — processamento de inventário, geração de OUT, relatórios.
- **Servidor/API + Dashboard** — histórico, BI, divergências, multi-loja.

## 🛠️ Tecnologias Utilizadas
- C# (.NET 6+), WPF
- SQLite (mobile e desktop)
- Node.js ou .NET API
- MySQL (servidor)
- React (dashboard)
- JWT (autenticação)

## 📁 Estrutura de Pastas
- `Mobile/` — código-fonte do app Android
- `Desktop/` — aplicação Windows
- `API/` — backend com endpoints REST
- `Dashboard/` — frontend React
- `Scripts/` — utilitários e testes
- `Diagramas/` — arquitetura, fluxo operacional e ERD
- `Documentação/` — resumos executivos, técnicos e para investidores
- `Relatórios/` — relatórios gerados pelo sistema

## 🔧 Instalação

### Desktop (Windows)
1. Instale o **.NET 6+**.
2. Abra a solução `.sln` no Visual Studio.
3. Compile e execute:
   ```bash
   dotnet build
   dotnet run
Mobile (Android)
1. 	Abra o projeto  no Android Studio.
2. 	Compile e instale no dispositivo.
3. 	Importe o arquivo OUT.csv gerado pelo Desktop.
Servidor/API
1. 	Acesse a pasta .
2. 	Instale dependências:
npm install
3. 	Configure o banco MySQL em .
4. 	Inicie o servidor:
npm start
Dashboard
1. 	Acesse a pasta .
2. 	Instale dependências:
3. 	Inicie o frontend:
npm start
▶️ Exemplos de Uso
Fluxo Operacional
1. 	Desktop: importar CSV do cliente e gerar OUT.
2. 	Mobile: coletar itens offline e gerar RETORNO.
3. 	Desktop: importar RETORNO e gerar relatórios.
4. 	Servidor/Dashboard: visualizar BI, divergências e produtividade.
Exemplo de comando para importar CSV no Desktop
dotnet run --import dados/inventario.csv
Exemplo de endpoint da API
GET /api/inventarios/{id}
Authorization: Bearer <token>
📊 Banco de Dados
• 	SQLite local (mobile e desktop)
• 	MySQL (servidor)
• 	Diagrama ERD disponível em 
📄 Documentação
• 	Swagger/OpenAPI para API
• 	Diagramas UML e ERD
• 	Fluxo operacional disponível em 
👤 Perfis
• 	Operador: coleta via mobile
• 	Administrador: análise via dashboard
• 	Sistema: sincronização entre módulos
📖 Guia Rápido para Operadores
1. 	Abra o app mobile e carregue o arquivo OUT.csv.
2. 	Realize a coleta com scanner ou digitação rápida.
3. 	Corrija itens diretamente no app.
4. 	Gere o arquivo RETORNO.csv e envie para o Desktop.
5. 	O Desktop processa o retorno e gera relatórios automáticos.
📌 Observações
• 	Funciona 100% offline
• 	Arquivos de entrada/saída: , 
• 	Relatórios automáticos e painel de progresso
💡 Esse README agora está **completo e prático**: serve como guia para desenvolvedores, administradores e operadores.  

## 📊 Diagramas UML

### Casos de Uso
![Casos de Uso](Documentação/UML/casos_de_uso.png)

### Diagrama de Sequência
![Sequência](Documentação/UML/sequencia.png)

### Diagrama de Classes
![Classes](Documentação/UML/classes.png)
# 📦 Inventário Híbrido MVP

Este projeto é um MVP (Minimum Viable Product) para gerenciamento de inventário híbrido, com documentação técnica completa.

---

## 📑 Sumário
- [API](#api)
- [Diagramas UML](#-diagramas-uml)
- [Modelo ERD](#-modelo-erd)
- [Instalação e Execução](#-instalação-e-execução)

---

## API
A especificação da API está disponível em:
- `Documentação/API/openapi.yaml`

---

## 📊 Diagramas UML

### Casos de Uso
![Casos de Uso](Documentação/UML/casos_de_uso.png)

### Diagrama de Sequência
![Sequência](Documentação/UML/sequencia.png)

### Diagrama de Classes
![Classes](Documentação/UML/classes.png)

---

## 🗄 Modelo ERD
![ERD](Documentação/ERD/erd.png)

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Java instalado
- PlantUML (`plantuml.jar`) disponível na pasta `Documentação/UML`

### Gerar diagramas UML
Dentro da pasta `Documentação/UML`:
```powershell
java -jar plantuml.jar *.puml

Documentação/
 ├── API/
 │    └── openapi.yaml
 ├── UML/
 │    ├── casos_de_uso.puml
 │    ├── casos_de_uso.png
 │    ├── sequencia.puml
 │    ├── sequencia.png
 │    ├── classes.puml
 │    ├── classes.png
 │    └── plantuml.jar
 ├── ERD/
 │    └── erd.png
