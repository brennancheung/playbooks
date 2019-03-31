# update
sudo apt update
sudo apt upgrade -y

# install initial packages
echo "Installing misc packages"
sudo apt install -y openssh-server openssh-client curl vim jq

# SSH
echo "Setting up SSH"
sudo systemctl enable ssh
sudo service ssh restart
sudo dpkg-reconfigure openssh-server
mkdir ~/.ssh
chmod 700 ~/.ssh
curl https://github.com/brennancheung.keys >> ~/.ssh/authorized_keys

# passwordless sudo
echo "Enabling passwordless sudo"
echo "brennan ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers

# Docker
echo "Installing Docker"
curl -sSL get.docker.com | sh
sudo usermod -aG docker $USER

sudo sed -i 's/$/ cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory/' /boot/cmdline.txt

sudo bash -c 'cat << EOF > /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF'

sudo mkdir -p /etc/systemd/system/docker.service.d

sudo systemctl daemon-reload
sudo systemctl restart docker

# Swapfile
echo "Disabling swapfile"
sudo sed -i '/[/]swapfile/ s/^/#/' /etc/fstab
sudo swapoff -a

echo "The system now needs to reboot.  Please manually reboot the computer."
echo "Setup can continue in pi-kubernetes-2.sh"
