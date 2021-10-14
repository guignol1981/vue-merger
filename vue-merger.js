import { writeFileSync, createReadStream, appendFileSync } from 'fs';
import { createInterface } from 'readline';

const nom = 'entete'; // todo: bind node param from command line
const htmlPath = 'exemple/entete.html'; // todo: dynamic path based on name
const tsPath = 'exemple/entete.ts'; // todo: dynamic path based on name
const scssPath = 'exemple/entete.scss'; // todo: dynamic path based on name
const vuePath = nom + '.vue'; // todo: put path at correct location

async function merge(path) {
    await mergeHTML(path);
    // await mergeTS(path)
    // await mergeSCSS(path)
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

function mergeTS() {
    return new Promise((resolve) => {
        appendFileSync(vuePath, '<script lang="ts">\n');

        const lineReaderTS = createInterface({
            input: createReadStream(tsPath),
        });

        lineReaderTS.on('line', function (line) {
            appendFileSync(vuePath, line + '\n');
        });

        lineReaderTS.on('close', function () {
            appendFileSync(vuePath, '</script>\n\n');
            resolve();
        });
    });
}

function mergeSCSS() {
    // todo: handle scope
    return new Promise((resolve) => {
        appendFileSync(vuePath, '<style lang="scss">\n');

        const lineReaderTS = createInterface({
            input: createReadStream(scssPath),
        });

        lineReaderTS.on('line', function (line) {
            appendFileSync(vuePath, line + '\n');
        });

        lineReaderTS.on('close', function () {
            appendFileSync(vuePath, '</style>\n');
            resolve();
        });
    });
}

export default merge;
