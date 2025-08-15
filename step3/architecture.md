# Step 3 — Distributed Laravel Architecture (Web, PHP-FPM, Redis, MySQL, ElasticSearch)

## Goals
- **Secure:** TLS, least-privilege networking, secrets management, backups
- **Scalable:** Stateless app tier, horizontal scaling, caching, queues, search shard/replica
- **Cost-Effective:** Right-size nodes, managed DB where possible, autoscaling only where needed

## High-level Design

```
                Internet
                    │
               [ TLS Termination ]
                    │
              +-----▼-----+
              |  Nginx    |  (reverse proxy / static)
              +-----+-----+
                    │
     ┌──────────────┼────────────────┐
     │              │                │
+----▼----+    +----▼----+      +----▼----+
| php-fpm |xN  | php-fpm |xN    | php-fpm |xN   (horizontally scalable)
+----+----+    +----+----+      +----+----+
     │              │                │
     └──────────────┼────────────────┘
                    │  (internal network only)
            +-------▼--------+
            |   Redis        |  (cache, sessions, queues/Horizon)
            +-------+--------+
                    │
            +-------▼--------+
            |   MySQL        |  (managed: 1 primary + read replica)
            +-------+--------+
                    │
            +-------▼--------+
            | ElasticSearch  |  (1-3 data nodes + 1 master in small envs)
            +----------------+
```

- **Storage/Uploads:** Use object storage (e.g., S3-compatible) via Laravel filesystem to keep app stateless.
- **Sessions/Cache/Queue:** Redis.
- **Migrations:** Run via a one-off artisan job in CI/CD before deploying.
- **Horizon:** Separate worker deployment for queues.
- **Secrets:** Docker/Swarm/K8s secrets or parameter store (SSM).

## Docker Compose (single host, production-like)

```yaml
version: "3.9"
services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - app-storage:/var/www/public/storage:ro
    ports: ["80:80"]
    depends_on: [php]
    networks: [public, internal]

  php:
    image: your-registry/laravel-php-fpm:latest
    env_file: .env
    environment:
      - APP_ENV=production
    deploy:
      replicas: 3
    volumes:
      - app-code:/var/www
    networks: [internal]

  horizon:
    image: your-registry/laravel-php-fpm:latest
    command: php artisan horizon
    depends_on: [redis, php]
    env_file: .env
    networks: [internal]

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes: [ "redis-data:/data" ]
    networks: [internal]

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=app
      - MYSQL_USER=app
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    volumes: [ "mysql-data:/var/lib/mysql" ]
    networks: [internal]

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    volumes: [ "es-data:/usr/share/elasticsearch/data" ]
    networks: [internal]

volumes:
  app-code:
  app-storage:
  mysql-data:
  redis-data:
  es-data:

networks:
  public:
  internal:
```

> For truly distributed setups, move to **Docker Swarm** or **Kubernetes**:
> - Multiple php-fpm replicas behind Nginx ingress.
> - Redis cluster or managed Redis.
> - Managed MySQL (e.g., RDS/Aurora) with replica.
> - ElasticSearch with 3 data nodes (hot/warm if needed).

## Security Checklist
- TLS (Let's Encrypt via certbot/nginx or a cloud LB with certs)
- Restrict DB/Redis/ES to internal network only
- Non-root containers, read-only FS where possible
- Backups: MySQL automated, ES snapshots, object storage versioning
- Secrets: mounted as files, not env (K8s Secrets or SSM)
- WAF/rate-limiting on Nginx for admin routes
- Health checks and resource limits

## Cost Notes
- Start small: 1 VM (4 vCPU/8 GB) running Nginx + php-fpm x2 + Redis
- Managed MySQL (db.t3.small + storage autoscaling)
- ES on a separate small VM or use a hosted tier if available
- Scale php-fpm first; monitor with metrics and APM
```

