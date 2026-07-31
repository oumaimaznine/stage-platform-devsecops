# Deploiement Ansible - Stage Platform

## Comment executer le playbook

    docker exec -it stage_ansible ansible-playbook /workspace/ansible/deploy.yml -i /workspace/ansible/inventory.ini --ask-vault-pass

Le mot de passe du vault sera demande. Sans lui, impossible de se connecter a Nexus.

## Modifier le secret chiffre

    docker exec -it stage_ansible ansible-vault edit /workspace/ansible/group_vars/local/vault.yml

## Securite

Le mot de passe Nexus est chiffre via Ansible Vault dans group_vars/local/vault.yml.
no_log: true est applique sur la tache de connexion pour eviter toute fuite dans les logs.
