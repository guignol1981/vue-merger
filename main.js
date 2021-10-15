#!/usr/bin/env node

import merge from './vue-merger.js';
import findFiles from './file-finder.js';

const deep = !!(process.argv[2] || 0);

findFiles(merge, deep);
