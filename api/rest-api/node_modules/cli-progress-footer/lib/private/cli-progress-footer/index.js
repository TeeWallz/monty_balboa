"use strict";

const ensureString           = require("es5-ext/object/validate-stringifiable-value")
    , isObject               = require("type/object/is")
    , isValue                = require("type/value/is")
    , d                      = require("d")
    , strip                  = require("cli-color/strip")
    , resolveLinesLength     = require("./resolve-lines-length")
    , overrideStdProps       = require("./override-std-props")
    , progressAnimationProps = require("./progress-animation-props")
    , repaintProps           = require("./repaint-props");

class CliProgressFooter {
	constructor(options) {
		if (!isObject(options)) options = {};
		Object.defineProperties(this, {
			_progressLinesCount: d(0),
			_progressOverflowLinesCount: d(0),
			_progressContent: d(""),
			_rawProgressRows: d([]),
			_lastOutLineLength: d(0),
			_lastOutCharacters: d(""),
			_isActive: d(false),
			_shouldOverrideStdout: d(
				isValue(options.overrideStdout) ? Boolean(options.overrideStdout) : true
			),
			_shouldRedirectStderr: d(
				isValue(options.redirectStderr) ? Boolean(options.redirectStderr) : true
			)
		});
		this.restoreStd();
	}

	updateProgress(progressRows) {
		if (!Array.isArray(progressRows)) {
			progressRows = progressRows ? progressRows.split("\n") : [];
		}
		this._rawProgressRows = progressRows;
		if (progressRows.length) {
			if (this._shouldAddProgressAnimationPrefix) {
				const prefix = `${
					this._progressAnimationPrefixFrames[
						this._progressAnimationPrefixFramesCurrentIndex
					]
				} `;
				const paddingLength = [...strip(prefix)].length;
				progressRows = progressRows.map(progressRow => {
					if (!progressRow) return progressRow;
					return (
						prefix + progressRow.split("\n").join(`\n${ " ".repeat(paddingLength) }`)
					);
				});
			}
			this._progressContent = `${ progressRows.join("\n") }\n`;
			if (!this._isActive) this.overrideStd();
		} else {
			this._progressContent = "";
			if (!this._isActive) return;
		}
		this._repaint();
		const newProgressLinesCount = resolveLinesLength(this._progressContent);

		if (newProgressLinesCount !== this._progressLinesCount) {
			this._progressOverflowLinesCount += this._progressLinesCount - newProgressLinesCount;
			if (this._progressOverflowLinesCount < 0) this._progressOverflowLinesCount = 0;
		}
		this._progressLinesCount = newProgressLinesCount;
		if (!this._progressContent) {
			this.restoreStd();
			this._progressOverflowLinesCount = 0;
		}
	}
	writeStdout(data) { this._repaint(ensureString(data)); }

	_writeOriginalStdout(data) { process.stdout.write(data); }
	_updateLastOutCharacters(data) {
		const trailingData = strip(data.slice(-50));
		switch (trailingData.length) {
			case 0:
				break;
			case 1:
				this._lastOutCharacters = this._lastOutCharacters.slice(-1) + trailingData;
				break;
			default:
				this._lastOutCharacters = trailingData.slice(-2);
		}
	}
}

Object.defineProperties(CliProgressFooter.prototype, {
	...progressAnimationProps,
	...overrideStdProps,
	...repaintProps
});

module.exports = CliProgressFooter;
