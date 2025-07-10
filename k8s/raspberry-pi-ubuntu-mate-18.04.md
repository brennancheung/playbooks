# Raspberry Pi Setup for Ubuntu Mate 18.04


## Download Ubuntu Mate

https://ubuntu-mate.org/download/

Flash the image to the Micro SD card using https://www.balena.io/etcher/

Insert card and boot the pi.

Follow the prompts to install the OS.


## Update and install packages

`sudo apt update`

`sudo apt upgrade -y`

`sudo apt install -y openssh-server openssh-client curl vim jq`


## Enable passwordless sudo

Add the following line to `/etc/sudoers`

`brennan ALL=(ALL) NOPASSWD: ALL`


## Enable SSH

`sudo systemctl enable ssh`

`sudo service ssh restart`

`sudo dpkg-reconfigure openssh-server` to install keys for host.

`curl https://github.com/brennancheung.keys >> ~/.ssh/authorized_keys`

Edit `/etc/ssh/sshd_config` to disable password logins.
