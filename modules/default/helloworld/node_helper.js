var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
    defaults: {
        text: "Hello World!diaoge",
        foo: "I'm alive!",
    },

  start: function() {
    this.countDown = 10000000
  },

  	getNews:function(){
	var request = require('request');
    var news={}
	request.post({
	   url:'http://api.tianapi.com/networkhot/index',
		   form:{
				key:'7dfa07f5e5b3ff1da40bd50375b64cd6'
	   } 
	   },function(err,response,body ){
           this.news=body
    });
    return news;
	},

  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "DO_YOUR_JOB":
        //   var newsItem=getNews();
        //   payload=newsItem;
        this.sendSocketNotification("I_DID", payload)
        break

    }
  },
})