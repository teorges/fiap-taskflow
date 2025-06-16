
# Taskflow FIAP Project

## Rodando com Docker Compose
```bash
docker-compose up --build
```

### Notification-Service
```bash
docker-compose logs -f notification-service
```

### Log-Service
```bash
docker exec -it log-service tail -f /app/logs.txt
```

## Rodando Localmente

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados
```bash
MongoDB local ou Docker (porta padrão 27017)
```
