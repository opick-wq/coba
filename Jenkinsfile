pipeline {
    agent any
    environment {
        ANSIBLE_FORCE_COLOR = 'true'
    }
    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main', url: 'https://github.com/rainyoumil/infra-ansible-jenkins.git'
            }
        }

        stage('Print Working Directory') {
            steps {
                sh 'pwd && ls -lah'
            }
        }
        
        stage('Run Ansible Playbook') {
            steps {
                sshagent(['ansible-ssh-key']) {
                    sh 'ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i host.ini deploy.yml || exit 1'
                }
            }
        }
    }
}
