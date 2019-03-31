# Raspberry Pi Setup


## Download Ubuntu Mate

https://ubuntu-mate.org/download/

Flash the image to the Micro SD card using https://www.balena.io/etcher/


## Enable SSH

Use `sudo raspi-config` and turn on SSH.

`apt-get install openssh-server openssh-client`

`sudo dpkg-reconfigure openssh-server` to install keys for host.

Edit `/etc/ssh/sshd_config` and add the relevant options.

Copy over my public SSH key into ~/.ssh/authorized_keys

`curl https://github.com/<username>.keys >> ~/.ssh/authorized_keys`

Not sure if this is needed:

`sudo touch /boot/ssh``


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

