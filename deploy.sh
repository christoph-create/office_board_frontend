#!/bin/sh
sudo docker image rm -f our-server:latest
sudo docker build . -t our-server
sudo docker run -it --rm -p 8081:80 our-server