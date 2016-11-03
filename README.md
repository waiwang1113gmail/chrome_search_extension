# Chrome Extension
A simple extensions for Chrome browser to allow user to search the selected search on any predefined website

## Content
* A configuration page for managing the websites to search
* Adding new right-click menu items when clicking the selected text 

All data about the targeted websites are stored in chrome storage.
Chrome event page is responsible for initializing the context menu. When the event page is loaded, it start registering the changed listener for the updates of Chrome storage and using the new values to update the context menu. Moreover, after it registed the changed listener, the event page loads website data from Chrome storage to construct context menu.

the data model for website information storage in Chrome storage:
	{
		"name":"Website_name", 	//unique identifier assined to the website
		"url":"url",			//URL for the website, Note it is also including the search parameter
		"enabled":"true"		//parameter for enable to diable it on context menu
	} 

This extension also includes an options page for managing the websites. 
