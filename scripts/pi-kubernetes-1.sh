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

echo "------------------------------------"
echo "For some strange reason the automation didn't work but manually did"
echo "Might want to perform this step manually."
sudo sed -i 's/$/ cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory/' /boot/cmdline.txt

# Reboot
echo "Reboot here"
