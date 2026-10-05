pipeline{

    stages{
        stage('Clean Workspace'){
         steps{
            deleteDir()
            echo "WorkSpace Cleaned Successfully"
         }
        }

        stage("Checkout the Code"){
         steps{
            git branch: 'main', url: 'https://github.com/Maheshreddy988/fullstack-devops-automation'
         }
        }
        stage("install Dependences"){
         steps{
            sh 'npm install'
         }
        }
    }
}