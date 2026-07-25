pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                checkout scm
            }
        }
        stage('Vérification') {
            steps {
                echo 'Le pipeline fonctionne correctement !'
                sh 'ls -la'
            }
        }
    }
}