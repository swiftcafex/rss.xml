var should = require("should");
var text = require("../text");

describe("FeedBuilder", function(){

	it("Channel Element Validation", function(){

		var feedBuilder = require("../feedBuilder");

		// channel title null
		var result = feedBuilder.buildRSS();
		result.should.be.instanceof(Error);
		result.message.should.equal(text["error.channel.title"]);

		// channel link null
		feedBuilder.title = "test title";		
		result = feedBuilder.buildRSS();
		result.should.be.instanceof(Error);
		result.message.should.equal(text["error.channel.link"]);		

		// channel description null
		feedBuilder.link = "test link";		
		result = feedBuilder.buildRSS();
		result.should.be.instanceof(Error);
		result.message.should.equal(text["error.channel.description"]);

		feedBuilder.desc = "test desc";		

		result = feedBuilder.buildRSS();
		// console.log(result);

	});

	it("Channel Item key bind", function(){

		var feedBuilder = require("../feedBuilder");

		var dataList = [
			{
				"name" : "news",
				"summary": "summary",
				"id" : "111",
				"url": "http://github.com",
				"date": new Date()
			},
			{
				"name" : "news",
				"summary": "summary",
				"id" : "111",
				"url": "http://github.com",
				"date": new Date()
			},
			{
				"name" : "news",
				"summary": "summary",
				"id" : "111",
				"url": "http://github.com",
				"date": new Date()
			},
			{
				"name" : "news",
				"summary": "summary",
				"id" : "111",
				"url": "http://github.com",
				"date": new Date()
			}
		];

		feedBuilder.keys.title = "name";
		feedBuilder.keys.link = "url";
		feedBuilder.keys.guid = "id";
		feedBuilder.keys.description = "summary";
		feedBuilder.keys.pubDate = "date";

		feedBuilder.data = dataList;

		feedBuilder.title = "News";
		feedBuilder.link = "http://github.com";
		feedBuilder.desc = "a news site";

		var result = feedBuilder.buildRSS();

		console.log(result);

	});

});