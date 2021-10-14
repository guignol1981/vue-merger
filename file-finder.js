import fs from 'fs';
import path from 'path';

function findFiles(callback) {
    function exploreDirectoryTree(currentPath = path.join(process.cwd())) {
        fs.readdirSync(currentPath).forEach((e) => {
            if (fs.lstatSync(path.join(currentPath, e)).isDirectory()) {
                exploreDirectoryTree(path.join(currentPath, e));
            } else if (e.includes('.scss')) {
                callback(path.join(currentPath, e).replace('.scss', ''));
            }
        });
    }

    exploreDirectoryTree();
}

export { findFiles };
