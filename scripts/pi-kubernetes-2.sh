# Docker
echo "Installing Docker"
curl -sSL get.docker.com | sh
sudo usermod -aG docker brennan


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
