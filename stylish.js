'use strict';
var chalk = require('chalk');
var table = require('text-table');

module.exports = {
	reporter: function (result, config, options) {
		var total = result.length;
		var ret = '';
		var headers = [];
		var prevfile;

		options = options || {};

		ret += table(result.map(function (el, i) {
			var err = el.error;
			// E: Error, W: Warning, I: Info
			var isError = err.code && err.code[0] === 'E';

			var line = [
				'',
				chalk.gray('line ' + err.line),
				chalk.gray('col ' + err.character),
				isError ? chalk.red(err.reason) : chalk.white(err.reason)
			];

			if (el.file !== prevfile) {
				headers[i] = el.file;
			}

			if (options.verbose) {
				line.push(chalk.gray('(' + err.code + ')'));
			}

			prevfile = el.file;

			return line;
		}), {
			stringLength: function (str) {
				return chalk.stripColor(str).length;
			}
		}).split('\n').map(function (el, i) {
			return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
		}).join('\n') + '\n\n';

		if (total > 0) {
			ret += chalk.red((process.platform !== 'win32' ? '✖ ' : '') + total + ' problem' + (total === 1 ? '' : 's'));
		} else {
			ret += chalk.green((process.platform !== 'win32' ? '✔ ' : '') + 'No problems');
			ret = '\n' + ret.trim();
		}

		console.log(ret + '\n');
	}
};
