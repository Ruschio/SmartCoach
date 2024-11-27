#!/bin/bash
echo "Installing SmartBugs ..."
install/setup-venv.sh
sudo usermod -a -G docker $USER