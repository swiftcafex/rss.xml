var text = require("./text");
var xml = require("xml");

var FeedBuilder = function() {
		
	this.title = null;
	this.link = null;
	this.desc = null;
	this.data = null;

	this.keys = {

		"title": null,
		"link": null,
		"description": null,
		"guid": null,
		"pubDate": null

	};

};

FeedBuilder.prototype.setChannelTitle = function(title) {
	
	this.title = title;

};

FeedBuilder.prototype.setChannelLink = function(link) {
	
	this.link = link;

};

FeedBuilder.prototype.setChannelDescription = function(desc) {
	
	this.desc = desc;

};


// Generate rss xml string
FeedBuilder.prototype.buildRSS = function() {
	
	if(!this.title) {
		

		return new Error(text["error.channel.title"]);

	}

	if(!this.link) {

		return new Error(text["error.channel.link"]);

	}

	if(!this.desc) {

		return new Error(text["error.channel.description"]);		

	}

	var root = { "rss" : [{_attr: { "version": "2.0"}}]};
	root["rss"].push({"title": this.title});
	root["rss"].push({"link": this.link});
	root["rss"].push({"description": this.desc});


	var self = this;

	if(this.data) {

		this.data.forEach(function(item){

			var xmlItem = [];			

			if(self.keys.title) {

				xmlItem.push({"title": item[self.keys.title]});				

			}


			if(self.keys.link) {

				xmlItem.push({"link": item[self.keys.link]});				

			}			

			if(self.keys.description) {

				xmlItem.push({"description": item[self.keys.description]});				

			}						
			// console.log(xmlItem);

			root["rss"].push({"item": xmlItem});
			

		});

	}

	
	// console.log(root);
	var xmlOutput = xml(root, true);
	return xmlOutput;

};

module.exports = new FeedBuilder();