FROM jenkins/jenkins:lts
USER root

# Docker CLI
RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz -o /tmp/docker.tgz \
    && tar xzf /tmp/docker.tgz -C /tmp \
    && cp /tmp/docker/docker /usr/local/bin/ \
    && chmod +x /usr/local/bin/docker \
    && rm -rf /tmp/docker /tmp/docker.tgz

# Node.js (necessaire pour l'analyse JS/TS de SonarQube)
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Gitleaks
RUN curl -fsSL https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz -o /tmp/gitleaks.tar.gz \
    && tar -xzf /tmp/gitleaks.tar.gz -C /usr/local/bin gitleaks \
    && chmod +x /usr/local/bin/gitleaks \
    && rm -f /tmp/gitleaks.tar.gz

# Trivy
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.72.0

# OWASP Dependency-Check
RUN curl -fsSL https://github.com/dependency-check/DependencyCheck/releases/download/v12.1.0/dependency-check-12.1.0-release.zip -o /tmp/dc.zip \
    && unzip -q /tmp/dc.zip -d /opt \
    && ln -sf /opt/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check \
    && rm -f /tmp/dc.zip

# SonarScanner CLI
RUN curl -fsSL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.0.2.4839-linux-x64.zip -o /tmp/sonar.zip \
    && unzip -q /tmp/sonar.zip -d /opt \
    && ln -sf /opt/sonar-scanner-7.0.2.4839-linux-x64/bin/sonar-scanner /usr/local/bin/sonar-scanner \
    && rm -f /tmp/sonar.zip

# kubectl
RUN curl -fsSL https://dl.k8s.io/release/v1.36.1/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl \
    && chmod +x /usr/local/bin/kubectl

USER jenkins