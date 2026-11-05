# Redis Local Setup

Docker Compose ke zariye Redis aur MongoDB ko locally run aur verify karne ke commands:

### 1. Start Containers
```bash
docker compose up -d
```

### 2. Check Status
```bash
docker compose ps
```

### 3. Redis CLI Connect
```bash
docker exec -it redis-server redis-cli
```
* Test command: `ping` -> Output: `PONG`
* Set a key: `set name "Shivam"`
* Get the key: `get name`

### 4. MongoDB Shell Connect
```bash
docker exec -it mongodb-server mongosh
```

### 5. Stop Containers
```bash
docker compose down
```
