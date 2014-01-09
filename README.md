axihome-server
==============

Automation intergrated for home's server based on nutsy server

What ?
------

Axihome-server can connect to different backend to integrate every piece of your home automation together in one place.

- Zwave (razpberry)
- Mpd (Music player daemon)
- Wmr100 (Oregon scientific weather station)
- More coming !
- You can devellop your own backend ! (see /processors for examples)

It has been develloped to work on a raspberry pi but you can run it on any hardware that support node.js

Install
-------

- First install the nutsy server : https://github.com/think-free/nutsy
- Then clone this repo as application folder and run npm install in that folder
- Run : ln -s application/endpoints
- Run : cp -R application/config ./
- Edit the configuration to your needs (editor is coming)

Run
---

- node main.js


