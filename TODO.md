***

Configuration interface
=======================

***

> Modules :
> ---------
> 
> **Configure a backend module**
> 
> 	processor : [get list from application processors folders]  
> 	name : textEntry  
> 	poolInterval : seconds * 1000  
> 	params : get all config entries for this module from config.json of the module  
> 	active or not  
>   
>   
> Modules association :  
> ---------------------  
>   
> **Associate object of the module in a place**  
>   
> 	module : Get module list (from ? Database ?)  
> 	name : textEntry  
> 	place : ComboBox (lib-tools::getPlaces) + textEntry to add one  
>   
>   
> Scenes :  
> --------  
>   
> **Create a scene**  
>   
>   
> Scenes association :  
> --------------------  
>   
> **Associate a scene to one or more places**  
>   
> 	name :  
> 	desc :  
> 	scene :  
> 	place :  
>   
> Schedule :  
> ----------  
>   
> **Schedule a scene load by time/date**  
>   
> 	cron : textEntry  
> 	scene : get scene list  
>   
> -> Should add one or more condition to play or not the scene  
>   
> Trigger :  
> ---------  
>   
> **Configure trigger when a variable change**  > 