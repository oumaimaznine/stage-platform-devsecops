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

        stage('Vérification') {
            steps {
                echo 'Pipeline terminé avec succès !'
            }
        }
    }
}