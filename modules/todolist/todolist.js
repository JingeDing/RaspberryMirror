/* global Module */

/* Magic Mirror
 * Module: todolist
 *
 * By {{AUTHOR_NAME}}
 * {{LICENSE}} Licensed.
 */

Module.register("todolist", {
	defaults: {
		updateInterval: 6000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		// var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
		var urlApi = "https://mirror.jinge.asia:8443/schedule/queryAll";
		//var urlApi = "http://api.tianapi.com/networkhot/index?key=7dfa07f5e5b3ff1da40bd50375b64cd6";

		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		console.log(this.dataRequest)
		// If this.dataRequest is not empty
		if (this.dataRequest) {
				
				var lable=document.createElement("label");
				lable.setAttribute("text-align",'center');
				lable.innerHTML=this.translate("我的日程");
				var mydiv=document.createElement("div");
				mydiv.innerHTML=Object.keys(this.dataRequest).length;
		        var mytable=document.createElement("table");
		        var mytablebody = document.createElement("tbody");
		for(var cont=1;cont<Object.keys(this.dataRequest).length;cont++){
			for(var nextcont=cont;nextcont>0;nextcont--){
				if(this.dataRequest[nextcont-1].s_date>this.dataRequest[nextcont].s_date){
					var temp=this.dataRequest[nextcont-1].s_date;
					this.dataRequest[nextcont-1].s_date=this.dataRequest[nextcont].s_date;
					this.dataRequest[nextcont].s_date=temp;
					var temp1=this.dataRequest[nextcont-1].s_content;
					this.dataRequest[nextcont-1].s_content=this.dataRequest[nextcont].s_content;
					this.dataRequest[nextcont].s_content=temp1;
				}
			}
		}
				for(var z=0;z<3;z++){
					var current_row=document.createElement("tr");
					for(var t=0;t<2;t++){
						var current_cell=document.createElement("td");
						if(t==0){
						var message1=this.dataRequest[z].s_date;	
						var currenttext1=document.createTextNode(message1);
						current_cell.appendChild(currenttext1);
						}
						if(t==1){
						var message2=this.dataRequest[z].s_content;
						var currenttext2=document.createTextNode(message2);
						current_cell.appendChild(currenttext2);
						}
						current_row.appendChild(current_cell);
					}
					mytablebody.appendChild(current_row);
				}
				//wrapper.appendChild(mydiv);
				wrapper.appendChild(lable);
				mytable.appendChild(mytablebody);
				mytable.setAttribute("border","1");
			    wrapper.appendChild(mytable);

		
			// check format https://jsonplaceholder.typicode.com/posts/1
		 
			//wrapperDataRequest.innerHTML = this.dataRequest[4].nickname;
			// Use translate function
			//             this id defined in translations files
			//labelDataRequest.innerHTML = this.translate("TITLE");
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			// wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"todolist.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("todolist-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "todolist-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
