# Virtualization Playground

## Set up KVM

`sudo apt install qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils virt-manager -y`

#### Set up the bridge interface

Determine the main network interface (`enp5s0`) in this example.

Then add to `/etc/network/interfaces`:

    auto lo br0

    iface enp5s0 inet manual

    iface br0 inet dhcp
            bridge_ports enp5s0

#### virt-manager

Launch the virtual machine manager using `virt-manager`


## Set up Vagrant

`sudo apt install vagrant -y`


#### Troubleshooting

If `virt-manager` is not working try some of the following:

Verify KVM can use hardware acceleration:

`sudo kvm-ok`

`sudo adduser <username> libvirt`

`sudo adduser <username> libvirt-qemu`

`sudo systemctl start virtlogd.socket`

Also maybe try this:

https://www.linuxtechi.com/install-configure-kvm-ubuntu-18-04-server/

or

https://linuxconfig.org/install-and-set-up-kvm-on-ubuntu-18-04-bionic-beaver-linux

This video has more information but I don't quite understand everything:

https://www.youtube.com/watch?v=amTJHm19ts0

Also:

https://en.wikibooks.org/wiki/QEMU/Networking

https://www.linuxjournal.com/content/linux-advanced-routing-tutorial

