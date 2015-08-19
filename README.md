ballon-telldus
==============

using Telldus domotic API to control an boiller connected to a wireless plug.

this app uses passport to secure the service to a controlled amout of users and render the website

Steps to run the app
=====================
* After cloning the repo, install the dependencies by running **npm install**
* Create facebook and twitter apps and update the config files fb.js and twitter.js with the respective app details before running the server.
* add your Telldus API credentials in telldus/telldusConfig
* add the Telldus device ID for the connected plug in telldus/ballonConfig
* To start the server, run **npm start** on the base directory
 

Perquisites
============
The server assumes that you have a local mongo instance running. This means if you have mongo installed locally, all you need to do is configure the db.js file correctly and run the mongod daemon
