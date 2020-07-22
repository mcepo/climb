#!/bin/sh

# If you would like to do some extra provisioning you may
# add any commands you wish to this file and they will
# be run after the Homestead machine is provisioned.
#
# If you have user-specific configurations you would like
# to apply, you may also create user-customizations.sh,
# which will be run after this script.

sudo ln -sf /usr/share/zoneinfo/Europe/Zagreb /etc/localtime

#  update & upgrade packages
sudo apt update
sudo apt -y upgrade
sudo reboot


## installing postgis
sudo apt -y install gnupg2
sudo apt -y install postgis postgresql-11-postgis-2.5