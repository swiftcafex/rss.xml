'use strict';
import test from 'ava';

const xmljs = require('xml-js');
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
