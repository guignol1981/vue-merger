import { writeFileSync, createReadStream, appendFileSync } from 'fs';
import fs from 'fs';
import { createInterface } from 'readline';
import nodePath from 'path';

async function merge(path, options, clean) {
    let componentName;

    if (options.html) {
        await mergeHTML(path);
    }

    if (options.ts) {
        componentName = await mergeTS(path);
    }

    if (options.scss) {
        await mergeSCSS(path);
    }

    await createIndex(path, componentName);

    if (clean) {
        removeOldFiles(path, options);
    }
}

function mergeHTML(path) {
    return new Promise((resolve) => {
        writeFileSync(path + '.vue', '<template>\n');

        const lineReaderHTML = createInterface({
            input: createReadStream(path + '.html'),
        });

        lineReaderHTML.on('line', function (line) {
            appendFileSync(path + '.vue', line + '\n');
        });

        lineReaderHTML.on('close', function () {
            appendFileSync(path + '.vue', '</template>\n\n');
            resolve();
        });
    });
}

function mergeTS(path) {
    return new Promise((resolve) => {
        let componentName;

        appendFileSync(path + '.vue', '<script lang="ts">\n');

        const lineReaderTS = createInterface({
            input: createReadStream(path + '.ts'),
        });

        lineReaderTS.on('line', function (line) {
            if (!line.includes('WithRender')) {
                if (line.includes('extends') && !line.includes('default')) {
                    // insert 'default ' into position
                    const position = 7;
                    const output = [
                        line.slice(0, position),
                        'default ',
                        line.slice(position),
                    ].join('');

                    appendFileSync(path + '.vue', output + '\n');
                } else {
                    appendFileSync(path + '.vue', line + '\n');
                }
            }

            if (line.includes('export default class ')) {
                componentName = line
                    .split('export default class ')[1]
                    .split(' extends')[0];
            } else if (line.includes('export class ')) {
                componentName = line
                    .split('export class ')[1]
                    .split(' extends')[0];
            }
        });

        lineReaderTS.on('close', function () {
            appendFileSync(path + '.vue', '</script>\n\n');
            resolve(componentName);
        });
    });
}

function mergeSCSS(path) {
    return new Promise((resolve) => {
        appendFileSync(path + '.vue', '<style scoped lang="scss">\n');

        const lineReaderTS = createInterface({
            input: createReadStream(path + '.scss'),
        });

        lineReaderTS.on('line', function (line) {
            appendFileSync(path + '.vue', line + '\n');
        });

        lineReaderTS.on('close', function () {
            appendFileSync(path + '.vue', '</style>\n');
            resolve();
        });
    });
}

function createIndex(path, componentName) {
    return new Promise((resolve) => {
        const filename = nodePath.basename(path);
        const dirname = nodePath.dirname(path);

        writeFileSync(
            dirname + '/index.ts',
            'export { default as ' +
                componentName +
                " } from './" +
                filename +
                ".vue'"
        );

        resolve();
    });
}

function removeOldFiles(path, options) {
    if (options.html) {
        fs.unlink(path + '.html', () => {});
    }

    if (options.ts) {
        fs.unlink(path + '.ts', () => {});
    }

    if (options.scss) {
        fs.unlink(path + '.scss', () => {});
    }
}

export default merge;
