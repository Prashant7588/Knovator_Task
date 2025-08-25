pipeline {
    agent any

    parameters {
        choice(
            name: 'STEP',
            choices: ['step1', 'step2', 'step3'],
            description: 'Select which step to run'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Prashant7588/Knovator_Task', credentialsId: 'github-credentials'
            }
        }

        stage('Run Step') {
            steps {
                script {
                    if (params.STEP == "step1") {
                        dir("step1") {
                            sh 'docker-compose down || true'
                            sh 'docker-compose up -d --build'
                        }
                    } else if (params.STEP == "step2") {
                        dir("step2") {
                            sh 'echo "Step2: GitLab CI/CD design placeholder."'
                        
                        }
                    } else if (params.STEP == "step3") {
                        dir("step3") {
                            sh 'docker-compose down || true'
                            sh 'docker-compose up -d --build'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully for ${params.STEP}."
        }
        failure {
            echo "Pipeline failed for ${params.STEP}."
        }
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
    }
}
