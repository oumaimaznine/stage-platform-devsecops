pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
    }

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

        stage('Analyse qualité de code (SonarQube)') {
            steps {
                echo 'Analyse de la qualité du code avec SonarQube...'
                sh 'sonar-scanner -Dsonar.token=$SONAR_TOKEN'
            }
        }

        stage('Build image Backend') {
            steps {
                echo 'Construction de l\'image Docker du backend...'
                sh 'docker build -t stage-backend:latest ./stage-platform-laravel'
            }
        }

        stage('Build image Frontend') {
            steps {
                echo 'Construction de l\'image Docker du frontend...'
                sh 'docker build -t stage-frontend:latest ./frontend'
            }
        }

        stage('Extraction des dépendances') {
            steps {
                echo 'Extraction de vendor/ et node_modules/ depuis les images...'
                sh '''
                    docker create --name temp-backend stage-backend:latest
                    docker cp temp-backend:/var/www/vendor ./stage-platform-laravel/vendor || true
                    docker rm temp-backend

                    docker create --name temp-frontend stage-frontend:latest
                    docker cp temp-frontend:/app/node_modules ./frontend/node_modules || true
                    docker rm temp-frontend
                '''
            }
        }

        stage('Analyse des dépendances (OWASP Dependency-Check)') {
            steps {
                echo 'Analyse des dépendances à la recherche de vulnérabilités connues...'
                sh 'dependency-check --project stage-platform --scan ./stage-platform-laravel/vendor --scan ./frontend/node_modules --format HTML --out dependency-check-report || true'
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

    post {
        always {
            archiveArtifacts artifacts: 'dependency-check-report/**', allowEmptyArchive: true
        }
    }
}