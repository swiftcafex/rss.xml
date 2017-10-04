'use strict';
import test from 'ava';

const xmljs = require('xml-js');
const rss = require('../feed-builder');

test('bind list to generate rss content', t => {
	const builder = rss.newBuilder();

	builder.title = 'SwiftCafe';
	builder.link = 'https://swiftcafe.io';
	builder.description = 'enjoy code';

	const collection = [
		{
			title: 'About Xcode 9',
			url: 'https://swiftcafe.io',
			summary: 'an article about Xcode 9',
			date: '2017-01-12',
			id: '12'
		},
		{
			title: 'About Xcode 9',
			url: 'https://swiftcafe.io',
			summary: 'an article about Xcode 9',
			date: '2017-01-12',
			id: '12'
		},
		{
			title: 'About Xcode 9',
			url: 'https://swiftcafe.io',
			summary: 'an article about Xcode 9',
			date: '2017-01-12',
			id: '12'
		},
		{
			title: 'About Xcode 9',
			url: 'https://swiftcafe.io',
			summary: 'an article about Xcode 9',
			date: '2017-01-12',
			id: '12'
		},
		{
			title: 'About Xcode 9',
			url: 'https://swiftcafe.io',
			summary: 'an article about Xcode 9',
			date: '2017-01-12',
			id: '12'
		}
	];

	builder.keys.title = 'title';
	builder.keys.link = 'url';
	builder.keys.description = 'summary';
	builder.keys.guid = 'id';
	builder.keys.pubDate = 'date';

	builder.data = collection;

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

		// Items bind
		t.is(channel.item.length, 5);

		channel.item.forEach((realRecord, index) => {
			const testRecord = collection[index];
			t.is(testRecord.title, realRecord.title._text);
			t.is(testRecord.url, realRecord.link._text);
			t.is(testRecord.summary, realRecord.description._text);
			t.is(testRecord.date, realRecord.pubDate._text);
			t.is(testRecord.id, realRecord.guid._text);
		});
	});
});
