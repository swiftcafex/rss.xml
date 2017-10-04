import test from 'ava';

const fresh = require('import-fresh');

const text = require('../text');

test('validation for necessory channel element', t => {
	const builder = fresh('../feed-builder');

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
	builder.description = '';
});
