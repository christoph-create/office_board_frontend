#!/bin/sh
sudo docker image rm -f our-server:latest
sudo docker rm -f office-board-frontend
sudo docker build . -t our-server:latest
sudo docker run -d -p 8080:80 --name office-board-frontend our-server:latest