data "aws_ami" "ubuntu" {

  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

}


resource "aws_instance" "fullstack-devops-automation" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.terraform_pulic_subnet.id
  vpc_security_group_ids      = [aws_security_group.InBound_outBound_Rules.id]
  associate_public_ip_address = true
  key_name                    = var.aws_key_pair


  root_block_device {
    volume_size           = var.Instance_volume_size
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  user_data = <<-USERDATA
  #!/bin/bash
  set -eux
  export DEBIAN_FRONTEND=noninteractive

  # Prerequisites
  apt-get update -y
  apt-get install -y ca-certificates curl

  # Docker's official GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  # Docker apt repository
  . /etc/os-release
  CODENAME="$${UBUNTU_CODENAME:-$VERSION_CODENAME}"
  ARCH="$(dpkg --print-architecture)"
  tee /etc/apt/sources.list.d/docker.sources <<REPO
  Types: deb
  URIs: https://download.docker.com/linux/ubuntu
  Suites: $CODENAME
  Components: stable
  Architectures: $ARCH
  Signed-By: /etc/apt/keyrings/docker.asc
  REPO

  # Install Docker
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable --now docker
  usermod -aG docker ubuntu
USERDATA

  user_data_replace_on_change = true

  tags = {
    Name = "${var.project_name}-server"
  }
}
