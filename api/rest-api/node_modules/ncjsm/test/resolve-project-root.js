"use strict";

const deferred    = require("deferred")
    , { resolve } = require("path");

const rootDir = resolve(__dirname, ".."), playgroundDir = resolve(__dirname, "__playground");

module.exports = function (t, a, d) {
	deferred(
		t(playgroundDir)(value => { a(value, rootDir, "node_modules"); }),
		t(resolve(playgroundDir, "otherdir"))(value => { a(value, rootDir, "Empty"); }),
		t(resolve(playgroundDir, "dir"))(value => { a(value, rootDir, "package.json"); }),
		t(resolve(playgroundDir, "node_modules/outer"))(value => {
			a(value, rootDir, "package.json and node_modules");
		}),
		t(resolve(playgroundDir, "node_modules/outer3"))(value => {
			a(value, rootDir, "In node_modules");
		})
	).done(() => { d(); }, d);
};
