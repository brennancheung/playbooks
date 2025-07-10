# New setup for Ubuntu 18.04 Desktop dev playground

## Customization

#### Customize keyboard and set CAPS to CTRL

`sudo apt install gnome-tweak-tool`

Turn off mouse acceleration.

Under `Additional Layout Options` set CAPS to CTRL.

#### Misc customizations

* Change default terminal size to be bigger.

* Remove useless nav items from sidebar

* Add terminal to left nav

* Disable turning off display and locking automatically.

* Change keyboard delay / repeat

* Enable the nVidia driver from Software & Updates

## Adding basic software

`sudo apt install ubuntu-restricted-extras net-tools vim -y `

From `Ubuntu Software` install `Spotify` and `VLC`.

## Enabling remote SSH

`sudo apt install ssh -y`

Add `/etc/hosts` alias.

Add pubkey to `~/.ssh/authorized_keys`.

## Passwordless sudo

Add `<username> ALL=(ALL) NOPASSWD:ALL` to `/etc/sudoers`
