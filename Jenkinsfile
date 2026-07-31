pipeline {
    agent any
    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
        NEXUS_CREDS = credentials('nexus-credentials')
        NEXUS_URL = 'localhost:8083'
        NVD_API_KEY = credentials('NVD_API_KEY')
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Recuperation du code depuis GitHub...'
                checkout scm
            }
        }
        stage('Scan des secrets (Gitleaks)') {
            steps {
                echo 'Analyse du code a la recherche de secrets...'
                sh 'gitleaks detect --source=. --verbose --no-git --config .gitleaks.toml'
            }
        }
        stage('Analyse qualite de code (SonarQube)') {
            steps {
                echo 'Analyse de la qualite du code avec SonarQube...'
                sh 'sonar-scanner -Dsonar.token=$SONAR_TOKEN'
            }
        }
        stage('Analyse des dependances (OWASP Dependency-Check)') {
            steps {
                echo 'Analyse des dependances a la recherche de vulnerabilites connues...'
                sh '''
                    dependency-check --project stage-platform \
                        --scan ./stage-platform-laravel/composer.lock \
                        --scan ./frontend/package-lock.json \
                        --format HTML --format JSON \
                        --out dependency-check-report \
                        --failOnCVSS 9 \
                        --nvdApiKey $NVD_API_KEY
                '''
            }
        }
        stage('Build image Backend') {
            steps {
                echo 'Construction de l\'image Docker du backend...'
                sh 'docker build -t stage-backend:latest ./stage-platform-laravel'
            }
        }
        stage('Scan de vulnerabilites (Trivy)') {
            steps {
                echo 'Analyse complete HIGH et CRITICAL, sans bloquer...'
                sh 'trivy image --severity HIGH,CRITICAL --no-progress stage-backend:latest || true'
                echo 'Verification stricte: blocage si vulnerabilite CRITICAL...'
                sh 'trivy image --severity CRITICAL --exit-code 1 --no-progress stage-backend:latest'
            }
        }
        stage('Push vers Nexus') {
            steps {
                echo 'Envoi de l\'image vers le registre Nexus...'
                sh '''
                    echo $NEXUS_CREDS_PSW | docker login $NEXUS_URL -u $NEXUS_CREDS_USR --password-stdin
                    docker tag stage-backend:latest $NEXUS_URL/stage-backend:latest
                    docker push $NEXUS_URL/stage-backend:latest
                '''
            }
        }
        stage('Verification') {
            steps {
                echo 'Pipeline termine avec succes !'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'dependency-check-report/**', allowEmptyArchive: true
        }
        failure {
            echo 'Le pipeline a echoue - verifier les resultats de securite (Gitleaks, Dependency-Check ou Trivy).'
        }
    }
}