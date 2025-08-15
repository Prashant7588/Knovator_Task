# Step 1 — Dockerize NodeJS & ReactJS with Nginx reverse proxy

## Prereqs (Ubuntu 20.04)

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
# re-login
```

## Run

```bash
cd step1
docker compose build
docker compose up -d
curl http://localhost/api/health
```

- Reverse proxy: http://localhost -> frontend
- API: proxied at http://localhost/api
