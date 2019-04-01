    1  ls -l
    2  sudo apt update
    3  id -u
    4  id
    5  id -h
    6  id --help
    7  id -n
    8  id -u
    9  id -r
   10  id -n -a
   11  id -a
   12  whoami
   13  sudo whoami
   14  id -u
   15  id -r
   16  sudo echo "brennan ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
   17  apt-get upgrade
   18  sudo apt upgrade -y
   19  sudo apt install jq
   20  sudo apt install -y openssh-server openssh-client curl vim jq
   21  sudo vim /etc/sudoers
   22  ll
   23  cd .ssh
   24  sudo touch /boot/ssh
   25  sudo init 6
   26  ll
   27  ll
   28  ssh localhost
   29  sudo systemctl ssh-server
   30  sudo systemctl status ssh-server
   31  sudo systemctl status ssh
   32  sudo systemctl enable ssh
   33  ssh localhost
   34  sudo vim /etc/ssh/sshd_config
   35  sudo dplg-reconfigure openssh-server
   36  sudo service ssh restart
   37  ssh localhost
   38  sudo dpkg-reconfigure openssh-server
   39  ssh localhost
   40  curl -O test http://google.com
   41  curl http://google.com
   42  curl https://github.com/brennancheung.keys >> ~/.ssh/authorized_keys
   43  ll
   44  cd .ssh
   45  ll
   46  ip addr
   47  echo $USER
   48  curl -sSL get.docker.com | sh`
   49  curl -sSL get.docker.com | sh
   50  sudo usermod -aG docker brennan
   51  sudo init 6
   52  docker run hello-world
   53  mount
   54  mount | grep cgroup
   55  cat /proc/cgroups
   56  sudo vim /boot/cmdline.txt
   57  sudo init 6
   58  sudo vim /etc/fstab
   59  swapon -h
   60  swapon
   61  swapoff -a
   62  sudo swapoff -a
   63  sudo vim /etc/fstab
   64  sudo swapoff -a
   65  swapon
   66  swapon
   67  sudo vim /etc/fstab
   68  sudo init 6
   69  swapon
   70  sudo swapoff -a
   71  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add
   72  sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
   73  sudo apt install kubeadm
   74  sudo apt install -y kubeadm
   75  sudo apt update
   76  sudo apt upgrade
   77  sudo apt autoremove
   78  sudo apt autoremove -y
   79  sudo init 6
   80  sudo kubeadm config images pull -v3`
   81  sudo kubeadm config images pull -v3
   82  sudo kubeadm init --pod-network-cidr=10.244.0.0/16
   83  sudo kubeadm init --pod-network-cidr 10.244.0.0/16
   84  sudo vim /etc/containerd/config.toml
   85  sudo vim /etc/docker/daemon.json
   86  sudo cat > /etc/docker/daemon.json <<EOF
   87  {
   88    "exec-opts": ["native.cgroupdriver=systemd"],
   89    "log-driver": "json-file",
   90    "log-opts": {
   91      "max-size": "100m"
   92    },
   93    "storage-driver": "overlay2"
   94  }
   95  EOF
   96  sudo vim /etc/docker/daemon.json
   97  mkdir -p /etc/systemd/system/docker.service.d
   98  sudo mkdir -p /etc/systemd/system/docker.service.d
   99  systemctl daemon-reload
  100  systemctl restart docker
  101  sudo kubeadm init --pod-network-cidr 10.244.0.0/16
  102  mkdir ~/temp
  103  vim kube-join-cmd.txt
  104  vim ~/.bashrc
  105  ll
  106  kubectl get pods --all-namespaces
  107  kg pods --all-namespaces
  108  kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
  109  kg pods --all-namespaces
  110  watch kubectl get pods --all-namespaces
  111  sudo init 0
  112  top
  113  sudo shutdown -now
  114  sudo shutdown --nopw
  115  sudo shutdown --now
  116  sudo shutdown
  117  man shutdown
  118  sudo init 0
  119  kubectl get pods --all-namespaces
  120  top
  121  ll
  122  cat kube-join-cmd.txt
  123  vim kube-join-cmd.txt
  124  cat /boot/cmdline.txt
  125  ll
  126  cat kube-join-cmd.txt
  127  cat /proc/cgroups
  128  history
