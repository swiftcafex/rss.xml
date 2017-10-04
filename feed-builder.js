const xml = require('xml');
const dateFormat = require('dateformat');
const text = require('./text');
const pkg = require('./package.json');

/*
	Used to wrap rss content
*/
const FeedBuilder = function () {
	// Elements according RSS 2.0 Specification
	// http://cyber.harvard.edu/rss/rss.html

	// Necessary elements
	this.title = null;
	this.link = null;
	this.description = null;
	this.data = null;

	// Optional elements with default value.
	this.pubDate = null;		// Default: current date
	this.lastBuildDate = null;	// Default: current date
	this.generator = null;		// Default: rss.xml current version

	// Optional elements without default value.
	this.language = null;		// Eg. en-us
	this.copyright = null;		// Eg. Copyright 2002, Spartanburg Herald-Journal
	this.managingEditor = null;
	this.webMaster = null;
	this.category = null;
	this.docs = null;
	this.cloud = null;
	this.ttl = null;
	this.image = null;
	this.rating = null;
	this.textInput = null;		// The purpose of the <textInput> element is something of a mystery. You can use it to specify a search engine box. Or to allow a reader to provide feedback. Most aggregators ignore it.

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
		callback(new Error(text['error.channel.title']), null);
		return;
	}

	if (!this.link) {
		callback(new Error(text['error.channel.link']), null);
		return;
	}

	if (!this.description) {
		callback(new Error(text['error.channel.description']), null);
		return;
	}

	let channel = {channel: []};
	const root = {rss: [{_attr: {version: '2.0'}}, channel]};

	channel = channel.channel;
	// Set necessory elements
	channel.push({title: this.title});
	channel.push({link: this.link});
	channel.push({description: this.description});

	/* Set optional elements with default value */

	// PubDate and lastBuildDate.
	const now = new Date();
	const dateString = dateFormat(now, 'UTC:ddd, dd mmm yyyy HH:MM:ss Z');

	if (this.pubDate) {
		channel.push({pubDate: this.pubDate});
	} else {
		channel.push({pubDate: dateString});
	}

	if (this.lastBuildDate) {
		channel.push({lastBuildDate: this.lastBuildDate});
	} else {
		channel.push({lastBuildDate: dateString});
	}

	// Generator
	if (this.generator) {
		channel.push({generator: this.generator});
	} else {
		channel.push({generator: pkg.name + ' ' + pkg.version});
	}

	/* Set optional elements without default value */

	// Language
	if (this.language) {
		channel.push({language: this.language});
	}

	// Copyright
	if (this.copyright) {
		channel.push({copyright: this.copyright});
	}

	// ManagingEditor
	if (this.managingEditor) {
		channel.push({managingEditor: this.managingEditor});
	}

	// WebMaster
	if (this.webMaster) {
		channel.push({webMaster: this.webMaster});
	}

	// Category
	if (this.category) {
		channel.push({category: this.category});
	}

	// Docs
	if (this.docs) {
		channel.push({docs: this.docs});
	}

	// Cloud
	if (this.cloud) {
		channel.push({cloud: this.cloud});
	}

	// TTL
	if (this.ttl) {
		channel.push({ttl: this.ttl});
	}

	// Rating
	if (this.rating) {
		channel.push({ttl: this.rating});
	}

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

			root.rss.push({item: xmlItem});
		});
	}

	const xmlOutput = xml(root, true);
	callback(null, xmlOutput);
};

const BuilderManager = function () {

};

BuilderManager.prototype.newBuilder = function () {
	return new FeedBuilder();
};

module.exports = new BuilderManager();
