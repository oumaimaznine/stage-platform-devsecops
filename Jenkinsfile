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
                sh '''
                    docker run --rm -v "$(pwd):/repo" zricethezav/gitleaks:latest detect --source="/repo" --verbose --no-git || true
                '''
            }
        }

        stage('Vérification') {
            steps {
                echo 'Pipeline terminé avec succès !'
            }
        }
    }
}