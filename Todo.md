***

Configuration interface
=======================

***

Instance :
---------

**Configure a backend instance**

	backend : [get list from application backends folders]  
	name : textEntry  
	poolInterval : seconds * 1000  
	params : get all config entries for this instance from config.json of the instance  
	active or not  

- getAllBackends() : ok
- getConfigForBackend() : ok
- useInstance(name,true|false) : ok
- createInstance(backend, name, poolInterval, active, params[]) : ok
- deleteInstance(name) : ok
  
  
Devices association :  
---------------------  
  
**Associate object of the device in a place**  
  
	device : Get device list (from ? Database ?)  
	name : textEntry  
	place : ComboBox (lib-tools::getPlaces) + textEntry to add one  

- getAllDeviceId() : ok
- getAssociations() : ok
- getPlaces() : ok
- addAssociation(device, name, place) : ok
- removeAssociation(device, place) : ok

  
Scenes :  
--------  
  
**Create a scene**  
  
  List of actions for the scene, a scene can be played by the scheduler, a trigger or the user interface
  
>   backendName : the instance name of the processor  
>   backend : the backend  
>   deviceType : the type of device  
>   device : the id of the device  
>   actuator : the actuator of the device  
>   value : the value to put to the device actuator  
>   delay : delay before sending this value  
  
Scenes association :  
--------------------  
  
**Associate a scene to one or more places**  
  
	name :  
	desc :  
	scene :  
	place :  
  
Schedule :  
----------  
  
**Schedule a scene load by time/date**  
  
	cron : textEntry  
	scene : get scene list  
    conditions : list of device status needed to play the scene
  
-> Should add one or more condition to play or not the scene  
  
Trigger :  
---------  
  
**Configure trigger when a variable change**

Virtual devices :
-----------------

**Create and set status of virtual devices**  

Virtual devices can be used as conditions in scenes for example, users will edit there values  


***

Database storage
================

***

Store values to a database (couchdb ?, LevelDB ?)


***

Notifications
=============

***

Send notification to a generic notifier which will dispach the notification


***

Fixes
=====

*****

* Mpd backend can't be instanciated more than one time
* Configuration : Devices association : Allow to associate a device in more than one place



Couch DB 
========


{
   "_id": "_design/getDeviceHistory",
   "_rev": "50-eef7c08a3929c4f8f2c9615ee28c7c10",
   "language": "javascript",
   "views": {
       "getDeviceHistory": {
           "map": "function(doc) {\n\n\temit(doc._id, { timestamp : doc._id.split('-')[3], object : doc.value });\n}"
       }
   }
}

