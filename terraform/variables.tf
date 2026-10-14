
# Choose the Region
variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}


variable "project_name" {
  description = "fullstack-devops-automation"
  type        = string
  default     = "fullstack-devops-automation"
}


variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "Deployment environment"
}


variable "vpc_cidr" {
  description = "CIDR range for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet" {
  description = "CIDR range for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type for the application server"
  type        = string
  default     = "t3.micro"
}
variable "aws_key_pair" {
  type    = string
  default = "my-89787"
}

variable "Instance_volume_size" {
  description = "EC2 root disk size in GiB"
  type        = number
  default     = 8
}