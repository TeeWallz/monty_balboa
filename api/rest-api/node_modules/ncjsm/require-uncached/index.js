"use strict";

var objForEach          = require("es5-ext/object/for-each")
  , clear               = require("es5-ext/object/clear")
  , isObject            = require("type/object/is")
  , isPlainFunction     = require("type/plain-function/is")
  , ensureIterable      = require("type/iterable/ensure")
  , ensureString        = require("type/string/ensure")
  , ensurePlainFunction = require("type/plain-function/ensure");

module.exports = function (moduleIds, callback) {
	if (isPlainFunction(moduleIds)) {
		callback = moduleIds;
		moduleIds = null;
	} else {
		if (isObject(moduleIds)) {
			moduleIds = ensureIterable(moduleIds, {
				ensureItem: ensureString,
				name: "moduleIds",
				denyEmpty: true
			});
		} else {
			moduleIds = [ensureString(moduleIds)];
		}
		callback = ensurePlainFunction(callback, { name: "callback" });
	}

	// 2. Cache currently cached module values
	var cache = {};

	if (moduleIds) {
		moduleIds.forEach(function (moduleId) {
			cache[moduleId] = require.cache[moduleId];
			delete require.cache[moduleId];
		});
	} else {
		Object.assign(cache, require.cache);
		clear(require.cache);
	}

	try {
		// 3. Run callback
		return callback();
	} finally {
		// 4. Restore state
		objForEach(cache, function (value, moduleId) {
			if (value) require.cache[moduleId] = value;
			else delete require.cache[moduleId];
		});
	}
};
