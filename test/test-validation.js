import test from 'ava';

const xmljs = require('xml-js');
const text = require('../text');
const rss = require('../feed-builder');

test('validation for necessory channel element', t => {
	const builder = rss.newBuilder();

	// 1. should error, if channel title has not set.
	builder.buildRSS((error, rssContent) => {
		t.not(error, null);
		t.is(rssContent, null);
		t.is(error.message, text['error.channel.title']);
	});

	builder.title = 'SwiftCafe';

	// 2. should error, if channel link has not set.
	builder.buildRSS((error, rssContent) => {
		t.not(error, null);
		t.is(rssContent, null);
		t.is(error.message, text['error.channel.link']);
	});

	builder.link = 'https://swiftcafe.io';

	// 3. should error, if channel description has not set.
	builder.buildRSS((error, rssContent) => {
		t.not(error, null);
		t.is(rssContent, null);
		t.is(error.message, text['error.channel.description']);
	});
	builder.description = 'enjoy code';

	// 4. should success, if all necessary has been set.
	builder.buildRSS((error, rssContent) => {
		t.is(error, null);
		t.not(rssContent, null);

		const jsonString = xmljs.xml2json(rssContent, {compact: true});
		const json = JSON.parse(jsonString);
		const channel = json.rss.channel;

		t.is(channel.title._text, 'SwiftCafe');
		t.is(channel.link._text, 'https://swiftcafe.io');
		t.is(channel.description._text, 'enjoy code');
	});
});
