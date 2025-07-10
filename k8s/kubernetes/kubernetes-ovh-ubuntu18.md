# Set up Kubernetes on Ubuntu 18 on OVH

First, provision a dedicated server.

Next up we need to secure it because by default it is not very secure.

`apt update && apt upgrade -y` 
 
 `adduser brennan`

 `usermod -aG sudo brennan`

Copy your SSH info to where it should have been in the first place.

 `sudo cp -r /root/.ssh /home/brennan/`

`sudo chown -R brennan:brennan ~/brennan/.ssh`

Test that you can log in using the new username before proceeding.

`sudo passwd -l root`

 `sudo vi /etc/ssh/sshd_config`

 Secure by setting `PermitRootLogin no`, `PasswordAuthentication no`, and `PermitEmptyPasswords no`.

 sudo /etc/init.d/ssh restart

`sudo swapoff -a`

`sudo vim /etc/fstab` comment out the swap partitions

`sudo hostnamectl set-hostname HOSTNAME`

`sudo init 6`

`sudo visudo` and add `brennan ALL=(ALL) NOPASSWD: ALL` at the bottom.

`sudo apt install docker.io -y`

Sudo to root and then switch the docker daemon to use systemd:

```
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
```

`sudo usermod -aG docker $USER`

`sudo systemctl enable docker`

Reboot again to pick up new docker changes and verify it is working on startup.

`curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add`

`sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"`

`sudo apt install kubeadm -y`

`sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=IPADDRESS` (use `--dry-run` to get a preview and verify everything is ok)

The `10.244.0.0./16` is important if you want to use Flannel.

Follow instructions for kubeconfig.

`kubectl apply -f https://github.com/coreos/flannel/raw/master/Documentation/kube-flannel.yml`

Add the worker nodes and follow similar process.

Optional, allow workloads on master nodes `kubectl taint node MASTERNODE node-role.kubernetes.io/master:NoSchedule-`

Add the K8s dashboard:

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml`

Create an admin service account to use with Dashboard and Octant `kubectl create sa admin`

Extract the token and copy it to your clipboard 

`kubectl get secret admin-token-XXXXX -o jsonpath="{['data']['token']}" | base64 --decode | pbcopy`

Note: To get the CA in ASCII PEM format you can use:

`kubectl get secret admin-token-XXXXX -o jsonpath="{['data']['ca\.crt']}" | base64 --decode | pbcopy`

Modify the kubeconfig and add a user:

```
- name: admin-token
  user:
    token: TOKEN_GOES_HERE

```

Lock down ports with `ufw`.

`brew install helm`

`kubectl apply -f https://raw.githubusercontent.com/google/metallb/v0.8.3/manifests/metallb.yaml`

Configure the metallb load balancer.

```
cat > metallb-config.yml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - INSERT_CIDR_HERE
EOF
```
`kubectl apply -f metallb-config.yml`

