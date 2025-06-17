# TaskFlow - Projeto FIAP (Microserviços + Integrações)

Sistema de gerenciamento de tarefas com arquitetura de microserviços, integrado com Microsoft Teams e preparado para testes, logs e deploy com Docker.

---

## 📆 Estrutura do Projeto

```
/
├── frontend/                # Vue + Vite + Axios
├── backend/                 # Task Service (Node.js + Express + MongoDB)
├── notification-service/    # Notification Service (Webhook + Teams)
├── log-service/             # Log Service (salva logs locais)
├── tests/                   # Testes unitários com Jest
├── docker-compose.yml       # Orquestra microserviços
└── README.md
```

---

## 🏡 Serviços Disponíveis

| Serviço              | Porta | Descrição                       |
| -------------------- | ----- | ------------------------------- |
| Frontend Vue         | 5173  | Interface Web                   |
| Task Service         | 3000  | CRUD de tarefas REST API        |
| Notification Service | 4000  | Notificações + envio para Teams |
| Log Service          | 5000  | Armazena logs em `logs.txt`     |
| MongoDB              | 27017 | Banco de dados                  |

---

## 🚀 Como rodar o projeto

```bash
docker-compose up --build
```
---

## 📊 Acompanhar notificações (eventos)

```bash
docker-compose logs -f notification-service
```
---

## 📊 Acompanhar logs em tempo real

```bash
docker-compose logs -f log-service
```
---

## 🔐 Encerrar containers

```bash
docker-compose down
```

---

## 🖊️ Acesso + API

### Front-End

```bash
http://localhost:5173
```

### Swagger UI
```bash
http://localhost:3000/api-docs
```
---

## 🖊️ Exemplos de Uso

### Criar Tarefa (POST)

```bash
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Teste","description":"Teste 123"}'
```

### Ver Tarefas (GET)

```bash
curl http://localhost:3000/api/tasks
```

### Apagar Tarefa (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/tasks/<id>
```

### Registrar Log Manualmente

```bash
curl -X POST http://localhost:5000/log -H "Content-Type: application/json" -d '{"message":"Log manual de teste"}'
```

---

## 📝 Integração com Microsoft Teams

1. Crie um **Incoming Webhook** em um canal no Teams
2. Copie a URL gerada
3. Crie um arquivo `.env` na pasta `notification-service` com:

```
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
```

4. Reinicie o container:

```bash
docker-compose restart notification-service
```

---

## ✅ Testes Unitários e de Integração

### Testes Unitários com Jest

```bash
cd backend
npm install
npm run test
```

* Testa os endpoints de criação, leitura, atualização e remoção de tarefas
* Mock para dependências como notificação e log


### Pipeline CI/CD (GitHub Actions)

* Checkout código
* Instalar Node
* Instalar dependências no Backend
* Rodar testes do Backend (npm run test)


### Testes de Integração

* Simula fluxo completo (ex: cria tarefa -> dispara notificação -> registra log)

---

## 🚧 Tecnologias e Entregas Avaliadas

| Item                    | Entrega                                     |
| ----------------------- | ------------------------------------------- |
| Microservico CRUD       | TaskService com endpoints REST              |
| Microservico            | Notification + Log Service                  |
| Banco de Dados          | MongoDB via Docker                          |
| Testes Unit/Integracao  | Jest com mocks e fluxo completo             |
| CI/CD        			  | GitHub Actions                 				|
| Docker                  | Dockerfile + docker-compose                 |
| Swagger API             | Swagger no TaskService                      |
| Comunicacao Assincrona  | Envio de logs e notificacoes entre servicos |
| Frontend                | Vue + Vite + Axios                          |
| Integracao com Teams    | Webhook disparando eventos                  |


