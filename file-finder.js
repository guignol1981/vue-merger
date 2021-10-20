import fs from 'fs';
import path from 'path';

/**
 *
 * @param {function} callback: function that take a path and object of type {html: bool, scss: bool, ts: bool }
 * @param {number} deep : flag that determine if the function should deep in the directories (if yes 1, else nothing).
 */
function findFiles(callback, deep = false) {
    function exploreDirectoryTree(currentPath = path.join(process.cwd())) {
        fs.readdirSync(currentPath)
            .sort((a, b) => {
                a = path.join(currentPath, a);
                b = path.join(currentPath, b);

                if (
                    fs.lstatSync(a).isDirectory() &&
                    !fs.lstatSync(b).isDirectory()
                )
                    return -1;
                if (
                    !fs.lstatSync(a).isDirectory() &&
                    fs.lstatSync(b).isDirectory()
                )
                    return 1;
                return 0;
            })
            .every((e) => {
                const filePath = path.join(currentPath, e);

                if (fs.lstatSync(filePath).isDirectory() && deep) {
                    exploreDirectoryTree(filePath);
                } else if (e.includes('.html') && !e.includes('index')) {
                    const componentFiles = fs
                        .readdirSync(currentPath)
                        .filter((e) => e.includes('.scss') || e.includes('.ts'))
                        .concat(e);
                    console.log(e);
                    callback(filePath.replace('.html', ''), {
                        html: true,
                        scss: !!componentFiles.find((e) => e.includes('.scss')),
                        ts: !!componentFiles.find((e) => e.includes('.ts')),
                    });
                    return false;
                }
                return true;
            });
    }

    exploreDirectoryTree();
}
export default findFiles;
