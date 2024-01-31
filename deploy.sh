#!/bin/sh
sudo docker image rm -f our-server:latest
sudo docker build . -t our-server
sudo docker run -it --rm -p 8080:80 our-server