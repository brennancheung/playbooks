# Raspberry Pi Setup

## Download Ubuntu Mate

https://ubuntu-mate.org/download/

Flash the image to the Micro SD card using https://www.balena.io/etcher/

## Update everything

`sudo apt update`

`sudo apt ugprade -y`

## Enable SSH

Use `sudo raspi-config` and turn on SSH.

`apt-get install openssh-server openssh-client`

`sudo dpkg-reconfigure openssh-server`

Edit `/etc/ssh/sshd_config` and add the relevant options.

Copy over my public SSH key into ~/.ssh/authorized_keys

`curl https://github.com/<username>.keys >> ~/.ssh/authorized_keys`

Not sure if this is needed:

`sudo touch /boot/ssh``

## Install misc stuff

`sudo apt install curl -y`

## Install Docker

See the installation steps here:

https://gist.github.com/alexellis/fdbc90de7691a1b9edb545c17da2d975

`curl -sSL get.docker.com | sh`

sudo usermod -aG docker `whoami`

    sudo dphys-swapfile swapoff && \
    sudo dphys-swapfile uninstall && \
    sudo update-rc.d dphys-swapfile remove

`sudo vim /etc/fstab` and comment out the swapfile.  Then reboot.

Add `cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory` to the end of `/boot/cmdline.txt`.

## Install Kubernetes

These guides might be helpful:

https://linuxconfig.org/how-to-install-kubernetes-on-ubuntu-18-04-bionic-beaver-linux

https://github.com/alexellis/k8s-on-raspbian/blob/master/GUIDE.md

https://www.youtube.com/watch?v=t-4DFA1S0kY

Install the keys from Google:

`curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -`

Add the repo.  Note at this time Ubuntu 18.04 (Bionic Beaver) does not have its own package so we will use 16.04 (Xenial).

`sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"`

`sudo apt update`

`sudo apt install -y kubeadm`

Reboot. **Don't forget to reboot**

Fetch the K8s images:

`sudo kubeadm config images pull -v3`

Set up the master node.

`sudo kubeadm init --token-ttl=0 --pod-network-cidr 10.244.0.0/16 --apiserver-advertise-address <MASTER-NODE-IP>``

Run the commands it recommends:

    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config

Copy down the `join` command it gives you.  Copy it into a file somewhere.

Set up some convenience aliases in `~/.bash_profile`:

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

## Install node

https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/

Looks for the ARM binaries and `wget` them.

`tar xvpf node-[tarball`

`cd node-[path]`

`sudo cp -R * /usr/local/`

Verify node is working with:

`node -v`

and 

`npm -v`

