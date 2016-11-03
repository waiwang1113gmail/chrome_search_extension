//Following function call initializes website table
//it loads websites data from sync storage and uses the data to create the table
//for websites. 

(function(){
	//A map of names of website to be removed
	var websiteToRemove = {};
	var websiteTable = {};
	//class represent row of website table
	//Its getRow function return a Jquery object of tr element
	function WebsiteTableRow(site){
		var self=this;
		var removingWebsiteCheckBox = $("<input>").attr("type","checkbox")
			.change(function(){
				websiteToRemove[site.name] = this.checked;
			});
		this.selectableColumn = $('<td>').append(removingWebsiteCheckBox);
		this.nameColumn = $('<td>').text(site.name);
		var urlTextInput = $("<input>").attr({"type":"text","value":site.url}).addClass("form-control");
		this.urlColumn = $('<td>').append(urlTextInput);
		var enableCheckBox = $("<input>").attr("type","checkbox").prop("checked",site.enabled);
		this.enableColumn = $('<td>').append(enableCheckBox);
		var updateButton = $("<button>").addClass("btn btn-default").text("Update");
		updateButton.click(function(){
			var obj={}; 
			obj[site.name]={"name": site.name,"url":urlTextInput.prop("value"),"enabled":enableCheckBox.prop("checked")};
			chrome.storage.sync.set(obj);
		});
		this.updateButtonColumn = $('<td>').append(updateButton);
		var row = $('<tr>').append(
				self.selectableColumn,
				self.nameColumn,
				self.urlColumn,
				self.enableColumn,
				self.updateButtonColumn
				);
		this.getRow=function(){
			return row;
		}
	}

	var addRowToTable = function(site){
		var websiterow = new WebsiteTableRow(site);
		websiteTable[site.name] = websiterow;
		websiterow.getRow().appendTo($("tbody"));
	}
	chrome.storage.sync.get(null, function(values){
		for(var name in values){ 
			addRowToTable(values[name]);
		}
	});
	chrome.storage.onChanged.addListener(function(changes,namespace){
		for(var changedKey in changes){
			var site=changes[changedKey];
			if(site.oldValue && !site.newValue ){
				//remove row from table if the value is deleted
				websiteTable[site.oldValue.name].getRow().remove();
			}else if(!site.oldValue && site.newValue){
				addRowToTable(site.newValue);
			}
		}
	});
	var addMenuErrorMessage = $("#addItemErrorMessage");
	function hideMessage(){addMenuErrorMessage.hide();};
	var addMenuNameElement = $("#newWebsiteName").focus(hideMessage);
	var addMenuUrlElement = $("#newWebsiteUrl").focus(hideMessage);


	$("#remove").click(function(){
		for(var name in websiteToRemove){
			if(websiteToRemove[name]){
				chrome.storage.sync.remove(name);
				delete websiteToRemove[name];
			}
		}
	});
	$("#add").click(function(){ 
		var name=addMenuNameElement.val();
		var url=addMenuUrlElement.val();
		if(!name || !url){
			addMenuErrorMessage.show();
		}else{
			chrome.storage.sync.get(name,function(values){
				if(values[name]){
					addMenuErrorMessage.show();
				}else{
					var newWebSite = {};
					newWebSite[name] = {"name":name, "url":url, "enabled":true};
					chrome.storage.sync.set(newWebSite);
					$("#addWebsiteModal").modal('hide');
				}
			});
		}
	});

})();
