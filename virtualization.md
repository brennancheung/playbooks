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


#### How to set up bridged networking for the VM's

Take a look at `/etc/netplan/`.  If you are using a cloud-init you will need to disable
overwritting of the netplan files by following the instructions in the netplan file.

Read through https://fabianlee.org/2019/04/01/kvm-creating-a-bridged-network-with-netplan-on-ubuntu-bionic/

I created the following config in my netplan:

    network:
        version: 2
        ethernets:
            enp0s3:
                dhcp4: false

        bridges:
            br0:
                interfaces: [enp0s3]
                addresses: [10.0.0.103/24]
                dhcp4: true

I had to give the bridge my old IP that is hard-coded instead of going through DHCP.  I should probably make
sure the chosen IP will not be re-assigned to another host somehow but I think it will be fine for my purposes.

Other links I found:
  * https://amoldighe.github.io/2017/12/30/kvm-bridge-networking/


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


