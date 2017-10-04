'use strict';
import test from 'ava';

const xmljs = require('xml-js');
const dateFormat = require('dateformat');

const rss = require('../feed-builder');
const pkg = require('../package.json');

test('channel default values should be set', t => {
	const builder = rss.newBuilder();

	builder.title = 'SwiftCafe';
	builder.link = 'https://swiftcafe.io';
	builder.description = 'enjoy code';

	builder.buildRSS((error, rssContent) => {
		t.is(error, null);
		t.not(rssContent, null);
		const jsonString = xmljs.xml2json(rssContent, {compact: true});
		const json = JSON.parse(jsonString);
		const channel = json.rss.channel;

		// Necessary elements should same as they set in code above.
		t.is(channel.title._text, 'SwiftCafe');
		t.is(channel.link._text, 'https://swiftcafe.io');
		t.is(channel.description._text, 'enjoy code');

		// Default values

		// Default channel.generator
		const defaultGenerator = pkg.name + ' ' + pkg.version;
		t.is(channel.generator._text, defaultGenerator, 'channel.generator should have a default value.');

		// Default channel.pubDate & channel.lastBuildDate
		const now = Date.now();
		const diffTolerance = 2000;

		const pubDate = Date.parse(channel.pubDate._text);
		t.true((now - pubDate) < diffTolerance, 'channel.pubDate should have a default value witch diff from now less than 2 second');

		const lastBuildDate = Date.parse(channel.lastBuildDate._text);
		t.true((now - lastBuildDate) < diffTolerance, 'channel.lastBuildDate should have a default value witch diff from now less than 2 second');
	});
});

test('channel optional elements without default value, should not in result', t => {
	const builder = rss.newBuilder();

	builder.title = 'SwiftCafe';
	builder.link = 'https://swiftcafe.io';
	builder.description = 'enjoy code';

	builder.buildRSS((error, rssContent) => {
		t.is(error, null);
		t.not(rssContent, null);
		const jsonString = xmljs.xml2json(rssContent, {compact: true});
		const json = JSON.parse(jsonString);
		const channel = json.rss.channel;

		// Necessary elements should same as they set in code above.
		t.is(channel.title._text, 'SwiftCafe');
		t.is(channel.link._text, 'https://swiftcafe.io');
		t.is(channel.description._text, 'enjoy code');

		// Elements without default value.
		t.is(channel.language, undefined);
		t.is(channel.copyright, undefined);
		t.is(channel.managingEditor, undefined);
		t.is(channel.webMaster, undefined);
		t.is(channel.category, undefined);
		t.is(channel.docs, undefined);
		t.is(channel.cloud, undefined);
		t.is(channel.ttl, undefined);
		t.is(channel.image, undefined);
		t.is(channel.rating, undefined);
		t.is(channel.textInput, undefined);
	});
});

test('channel element should can be set, then generated in result', t => {
	const builder = rss.newBuilder();

	// Necessary Elements
	builder.title = 'SwiftCafe';
	builder.link = 'https://swiftcafe.io';
	builder.description = 'enjoy code';

	// Optioanl Elements with default value
	builder.generator = 'ava test';

	const dateForTest = new Date('2015-11-02');
	const dateString = dateFormat(dateForTest, 'UTC:ddd, dd mmm yyyy HH:MM:ss Z');
	builder.pubDate = dateString;
	builder.lastBuildDate = dateString;

	// Optional Elements without default value
	builder.language = 'en-us';
	builder.copyright = 'swiftcafe';
	builder.managingEditor = 'swiftcafex@gmail.com';
	builder.webMaster = 'swiftcafex@gmail.com';
	builder.category = 'Tech';
	builder.docs = 'https://swiftcafe.io';
	builder.cloud = 'https://swiftcafe.io';
	builder.ttl = '60';

	builder.buildRSS((error, rssContent) => {
		t.is(error, null);
		t.not(rssContent, null);
		const jsonString = xmljs.xml2json(rssContent, {compact: true});
		const json = JSON.parse(jsonString);
		const channel = json.rss.channel;

		// Necessary elements should same as they set in code above.
		t.is(channel.title._text, 'SwiftCafe');
		t.is(channel.link._text, 'https://swiftcafe.io');
		t.is(channel.description._text, 'enjoy code');

		// Optional Element with default value.
		t.is(channel.generator._text, 'ava test');
		t.is(channel.pubDate._text, dateString);
		t.is(channel.lastBuildDate._text, dateString);

		// Value should be set.
		t.is(channel.language._text, 'en-us');
		t.is(channel.copyright._text, 'swiftcafe');
		t.is(channel.managingEditor._text, 'swiftcafex@gmail.com');
		t.is(channel.webMaster._text, 'swiftcafex@gmail.com');
		t.is(channel.category._text, 'Tech');
		t.is(channel.docs._text, 'https://swiftcafe.io');
		t.is(channel.cloud._text, 'https://swiftcafe.io');
		t.is(channel.ttl._text, '60');
		// Ct.is(channel.image, undefined);
		// Ct.is(channel.rating, undefined);
		// Ct.is(channel.textInput, undefined);
	});
});

