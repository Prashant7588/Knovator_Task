# Konovator Screening Task — End-to-End Solution

This repository contains:
- **Step 1:** Dockerized NodeJS API & ReactJS app, composed and exposed via Nginx reverse proxy.
- **Step 2:** GitLab CI/CD pipeline targeting a self-hosted runner on a VM, deploying Docker images from a registry.
- **Step 3:** A secure, scalable, and cost-effective plan to host a distributed Laravel stack (Nginx, PHP-FPM, Redis, MySQL, ElasticSearch).

## Quick Start (Local)

```bash
cd step1
docker compose up -d --build
open http://localhost
```

## CI/CD

See `step2/.gitlab-ci.yml` and `step2/runner-setup.md`.
