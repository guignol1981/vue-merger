import merge from './vue-merger.js';
import { findFiles } from './file-finder.js';

findFiles((path) => merge(path));