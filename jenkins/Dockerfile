FROM jenkins/jenkins:lts
USER root
COPY --from=docker:24-cli /usr/local/bin/docker /usr/local/bin/docker
USER jenkins