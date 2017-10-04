const xml = require('xml');
const text = require('./text');

/*
	Used to wrap rss content
*/
const FeedBuilder = function () {
	this.title = null;
	this.link = null;
	this.desc = null;
	this.data = null;

	this.keys = {

		title: null,
		link: null,
		description: null,
		guid: null,
		pubDate: null

	};
};

// Generate rss xml string
FeedBuilder.prototype.buildRSS = function (callback) {
	if (!this.title) {
		callback(new Error(text['error.channel.title'], null));
		return;
	}

	if (!this.link) {
		callback(new Error(text['error.channel.link'], null));
		return;
	}

	if (!this.desc) {
		callback(new Error(text['error.channel.description'], null));
		return;
	}

	const root = {rss: [{_attr: {version: '2.0'}}]};
	root.rss.push({title: this.title});
	root.rss.push({link: this.link});
	root.rss.push({description: this.desc});

	const self = this;

	if (this.data) {
		this.data.forEach(item => {
			const xmlItem = [];

			if (self.keys.title) {
				xmlItem.push({title: item[self.keys.title]});
			}

			if (self.keys.link) {
				xmlItem.push({link: item[self.keys.link]});
			}

			if (self.keys.description) {
				xmlItem.push({description: item[self.keys.description]});
			}
			// Console.log(xmlItem);

			root.rss.push({item: xmlItem});
		});
	}

	// Console.log(root);
	const xmlOutput = xml(root, true);
	callback(null, xmlOutput);
};

module.exports = new FeedBuilder();
