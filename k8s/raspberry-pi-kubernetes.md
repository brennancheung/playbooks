# Install Docker and Kubernetes on Raspberry Pi running Ubuntu Mate 18.04


## Install Docker

`curl -sSL get.docker.com | sh`

sudo usermod -aG docker $USER

`sudo vim /etc/fstab` and comment out the swapfile.  Then reboot.

`sudo swapoff -a`

Add `cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1` to the end of `/boot/cmdline.txt`.

Use `systemd` for the `cgroupdriver`.  Might need to manually create this file in vim.

cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

    mkdir -p /etc/systemd/system/docker.service.d

Restart docker.

    systemctl daemon-reload
    systemctl restart docker


## Install Kubernetes

Install the keys from Google:

`curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -`

Add the repo.  Note at this time Ubuntu 18.04 (Bionic Beaver) does not have its own package so we will use 16.04 (Xenial).

`sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"`

`sudo apt update`

`sudo apt install -y kubeadm`

Reboot. **Don't forget to reboot**

Set up the master node.  This step can take a while (10+ minutes).

`sudo kubeadm init --pod-network-cidr 10.244.0.0/16`

Run the commands it recommends:

    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config

Copy down the `join` command it gives you.  Copy it into a file somewhere.

Set up some convenience aliases in `~/.bashrc`:

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

Install Flannel:

`kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml`

`sudo sysctl net.bridge.bridge-nf-call-iptables=1`


## Cleanup

`sudo apt autoremove -y`
