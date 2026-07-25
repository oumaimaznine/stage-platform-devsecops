pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Scan des secrets (Gitleaks)') {
            steps {
                echo 'Analyse du code à la recherche de secrets...'
                sh 'gitleaks detect --source=. --verbose --no-git || true'
            }
        }

        stage('Build image Backend') {
            steps {
                echo 'Construction de l\'image Docker du backend...'
                sh 'docker build -t stage-backend:latest ./stage-platform-laravel'
            }
        }

        stage('Scan de vulnérabilités (Trivy)') {
            steps {
                echo 'Analyse de l\'image Docker à la recherche de vulnérabilités...'
                sh 'trivy image --severity HIGH,CRITICAL --no-progress stage-backend:latest || true'
            }
        }

        stage('Vérification') {
            steps {
                echo 'Pipeline terminé avec succès !'
            }
        }
    }
}