
output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.terraform_vpc.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.terraform_pulic_subnet.id
}

output "security_group_id" {
  description = "ID of the EC2 security group"
  value       = aws_security_group.InBound_outBound_Rules.id
}

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.fullstack-devops-automation.id
}

output "ec2_public_ip" {
  description = "Public IPv4 address of the EC2 instance"
  value       = aws_instance.fullstack-devops-automation.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.fullstack-devops-automation.public_dns
}