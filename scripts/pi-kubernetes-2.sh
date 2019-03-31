# Prep for Kubernetes
echo "Adding Kubernetes apt repo"
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
sudo apt update

echo "Installing kubeadm"
sudo apt install -y kubeadm

echo "Prefetching Kubernetes images"
sudo kubeadm config images pull -v3

# Convience helpers
echo "Adding convenience helpers to ~/.bashrc"
bash -c 'cat << EOF >> ~/.bashrc

# Kubernetes convience aliases
alias k="kubectl"
alias kg="kubectl get"
alias kd="kubectl describe"
alias ka="kubectl apply"
alias g="kubectl get"

function sc() {
  CONFIG_FILE=~/kubeconfigs/$1.yml
  echo "Setting KUBECONFIG to $CONFIG_FILE"
  export KUBECONFIG=$CONFIG_FILE
}
EOF'

echo "Cleaning stale apt packages"
sudo apt autoremove -y

echo ""
echo "The system now needs to reboot.  Please manually reboot the computer."
echo ""
echo "Once the system is rebooted, run the 'kubeadm join' command saved from the master."
