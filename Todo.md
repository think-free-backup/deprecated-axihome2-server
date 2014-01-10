***

Configuration interface
=======================

***

Modules :
---------

**Configure a backend module**

	backend : [get list from application backends folders]  
	name : textEntry  
	poolInterval : seconds * 1000  
	params : get all config entries for this module from config.json of the module  
	active or not  
  
  
Modules association :  
---------------------  
  
**Associate object of the module in a place**  
  
	module : Get module list (from ? Database ?)  
	name : textEntry  
	place : ComboBox (lib-tools::getPlaces) + textEntry to add one  
  
  
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


