# update
sudo apt update
sudo apt upgrade -y

# install initial packages
sudo apt install -y openssh-server openssh-client curl vim jq

# SSH
sudo systemctl enable ssh
sudo service ssh restart
sudo dpkg-reconfigure openssh-server
curl https://github.com/brennancheung.keys >> ~/.ssh/authorized_keys
