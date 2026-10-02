fullstack-devops-automation/
│
├── frontend/                 # React/Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── backend/                  # Node/Express
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── Dockerfile
│
├── nginx/                    # Reverse proxy
│   └── nginx.conf
│
├── docker/                   # Docker configuration
│   └── docker-compose.yml
│
├── jenkins/                  # Jenkins CI/CD
│   └── Jenkinsfile
│
├── terraform/                # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── ansible/                  # Configuration management
│
├── k8s/                      # Kubernetes
│   ├── frontend/
│   ├── backend/
│   └── ingress/
│
├── scripts/                  # Bash/automation
│   ├── build.sh
│   └── deploy.sh
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
└── README.md