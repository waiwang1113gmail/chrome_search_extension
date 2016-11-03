
(function(){
	//this class manages all search items in right-click menu
	//it only has one method to update its menu items,
	//and depends on current state, it adds, updates or removes menu items
	function SearchMenu(){
		this.menuItems = {};
		var self=this;
		var menuItemListener = function(website){
			return function(info, tab){
				console.log({ url: website.url + info.selectionText });
				chrome.tabs.create({ url: website.url + info.selectionText });
			}
		}
		var addMenuItem = function(website){
			var menuId = Math.random().toString(36);
			chrome.contextMenus.create(
	  			{"title": website.name, id:menuId ,contexts:["selection"]});
			chrome.contextMenus.onClicked.addListener(menuItemListener(website));
			self.menuItems[website.name] = menuId;
		}
		var removeMenuItem = function(website){
			var menuId = self.menuItems[website.name];
			chrome.contextMenus.remove(menuId);
		}
		var updateMenuItemHelp = function(website){
			var menuId = self.menuItems[website.name];
			chrome.contextMenus.update(menuId,{"title": website.name, id:menuId ,contexts:["selection"]});
		}
		this.updateMenuItem=function(newValue, oldValue){
			if(newValue){
				if (oldValue && !oldValue.enabled && newValue.enabled || newValue.enabled ){
					addMenuItem(newValue);
				}else if(!newValue.enabled){
					removeMenuItem(newValue);
				}else if(oldValue && oldValue.enabled && newValue.enabled ){
					updateMenuItemHelp(newValue);
				}
			}else if(oldValue.enabled){
				removeMenuItem(oldValue);
				console.log(oldValue);
			}
		}
	}
	var menu = new SearchMenu();
	chrome.storage.onChanged.addListener(function(changes,namespace){
		for(var changedKey in changes){
			menu.updateMenuItem(changes[changedKey].newValue,changes[changedKey].oldValue);
		}
	});

	//loading all websites information from chrome storage
	chrome.storage.sync.get(null, function(values){
		for(var name in values){
			menu.updateMenuItem(values[name],null);
		}
	});
})();
