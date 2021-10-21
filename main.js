#!/usr/bin/env node

import merge from './vue-merger.js';
import findFiles from './file-finder.js';

const args = getArgs();
const deep = !!(args.deep || 0);
const clean = !!(args.clean || 0);

findFiles((path, options) => merge(path, options, clean), deep);

function getArgs() {
    const args = {};

    process.argv.slice(2, process.argv.length).forEach((arg) => {
        if (arg.slice(0, 2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2, longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;

            args[longArgFlag] = longArgValue;
        }
    });

    return args;
}
