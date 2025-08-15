# Self-hosted GitLab Runner (VM-based)

## Install (Ubuntu 20.04)

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install -y gitlab-runner
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

## Register

```bash
sudo gitlab-runner register
# URL: https://gitlab.com/ or your self-managed URL
# Token: <from your GitLab project>
# Description: prod-runner
# Tags: self-hosted,prod-runner
# Executor: shell OR docker (recommend docker)
```

If using docker executor, ensure privileged mode for building images with DinD.

## Secure variables

In GitLab -> Settings -> CI/CD -> Variables (masked & protected):
- CI_REGISTRY, CI_REGISTRY_USER, CI_REGISTRY_PASSWORD (auto on GitLab SaaS)
- Any domain/secret envs as needed
