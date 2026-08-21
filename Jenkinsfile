pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
        NEXUS_CREDS = credentials('nexus-credentials')
        NEXUS_URL = 'localhost:8083'
        NVD_API_KEY = credentials('NVD_API_KEY')

        IMAGE_TAG = "${BUILD_NUMBER}"
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

                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.token=$SONAR_TOKEN'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Attente du resultat du Quality Gate SonarQube...'

                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Analyse des dependances (OWASP Dependency-Check)') {
            steps {
                echo 'Analyse des dependances a la recherche de vulnerabilites connues...'

                sh '''
                    dependency-check --project stage-platform \
                        --scan ./stage-platform-laravel/composer.lock \
                        --scan ./frontend/package-lock.json \
                        --format HTML \
                        --format JSON \
                        --out dependency-check-report \
                        --failOnCVSS 9 \
                        --nvdApiKey $NVD_API_KEY \
                        --disableOssIndex true
                '''
            }
        }

        stage('Build image Backend') {
            steps {
                echo "Construction de l'image Docker backend version ${IMAGE_TAG}..."

                sh """
                    docker build \
                        -t stage-backend:${IMAGE_TAG} \
                        -t stage-backend:latest \
                        ./stage-platform-laravel
                """
            }
        }

        stage('Build image Frontend') {
            steps {
                echo "Construction de l'image Docker frontend version ${IMAGE_TAG}..."

                sh """
                    docker build \
                        -t stage-frontend:${IMAGE_TAG} \
                        -t stage-frontend:latest \
                        ./frontend
                """
            }
        }

        stage('Scan de vulnerabilites (Trivy)') {
            steps {
                echo "Analyse Backend HIGH et CRITICAL..."
                sh """
                    trivy image \
                        --severity HIGH,CRITICAL \
                        --no-progress \
                        --timeout 15m \
                        stage-backend:${IMAGE_TAG} || true
                """

                echo 'Verification stricte Backend: blocage si vulnerabilite CRITICAL...'

                sh """
                    trivy image \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        --timeout 15m \
                        --ignorefile .trivyignore-backend \
                        stage-backend:${IMAGE_TAG}
                """

                echo "Analyse Frontend HIGH et CRITICAL..."
                sh """
                    trivy image \
                        --severity HIGH,CRITICAL \
                        --no-progress \
                        --timeout 15m \
                        stage-frontend:${IMAGE_TAG} || true
                """

                echo 'Verification stricte Frontend: blocage si vulnerabilite CRITICAL...'

                sh """
                    trivy image \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        --timeout 15m \
                        --ignorefile .trivyignore-frontend \
                        stage-frontend:${IMAGE_TAG}
                """
            }
        }

        stage('Push vers Nexus') {
            steps {
                echo "Envoi des images version ${IMAGE_TAG} vers Nexus..."

                sh '''
                    echo "$NEXUS_CREDS_PSW" | docker login "$NEXUS_URL" \
                        -u "$NEXUS_CREDS_USR" \
                        --password-stdin

                    docker tag stage-backend:${IMAGE_TAG} \
                        ${NEXUS_URL}/stage-backend:${IMAGE_TAG}

                    docker push \
                        ${NEXUS_URL}/stage-backend:${IMAGE_TAG}

                    docker tag stage-frontend:${IMAGE_TAG} \
                        ${NEXUS_URL}/stage-frontend:${IMAGE_TAG}

                    docker push \
                        ${NEXUS_URL}/stage-frontend:${IMAGE_TAG}

                    docker tag stage-backend:${IMAGE_TAG} \
                        ${NEXUS_URL}/stage-backend:latest

                    docker push \
                        ${NEXUS_URL}/stage-backend:latest

                    docker tag stage-frontend:${IMAGE_TAG} \
                        ${NEXUS_URL}/stage-frontend:latest

                    docker push \
                        ${NEXUS_URL}/stage-frontend:latest
                '''
            }
        }

        stage('Deploiement Kubernetes') {
            steps {
                echo "Deploiement de la version ${IMAGE_TAG} sur Kubernetes..."

                sh """
                    kubectl --kubeconfig=/var/jenkins_home/.kube-config \
                        set image deployment/stage-backend \
                        stage-backend=localhost:8083/stage-backend:${IMAGE_TAG} \
                        -n default

                    kubectl --kubeconfig=/var/jenkins_home/.kube-config \
                        set image deployment/stage-frontend \
                        stage-frontend=localhost:8083/stage-frontend:${IMAGE_TAG} \
                        -n default

                    kubectl --kubeconfig=/var/jenkins_home/.kube-config \
                        rollout status deployment/stage-backend \
                        -n default \
                        --timeout=120s

                    kubectl --kubeconfig=/var/jenkins_home/.kube-config \
                        rollout status deployment/stage-frontend \
                        -n default \
                        --timeout=120s
                """
            }
        }

        stage('Verification') {
            steps {
                echo "Pipeline termine avec succes pour la version ${IMAGE_TAG} !"

                sh """
                    kubectl --kubeconfig=/var/jenkins_home/.kube-config \
                        get pods -n default -o wide
                """
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'dependency-check-report/**',
                allowEmptyArchive: true
            )
        }

        failure {
            echo 'Le pipeline a echoue - verifier les resultats de securite (Gitleaks, Dependency-Check ou Trivy).'
        }
    }
}