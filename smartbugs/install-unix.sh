#!/bin/bash
echo "Installing SmartBugs ..."
sudo usermod -a -G docker $USER
install/setup-venv.sh