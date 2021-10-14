import { initialize } from './vue-merger.js';
import { findFiles } from './file-finder.js';

findFiles((path) => initialize(path));
