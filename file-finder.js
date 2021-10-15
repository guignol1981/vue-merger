import fs from 'fs';
import path from 'path';

function joinResultPath(p, q = '') {
    return path.join(p, q);
}

function findFiles(callback) {
    function exploreDirectoryTree(currentPath = joinResultPath(process.cwd())) {
        fs.readdirSync(currentPath).forEach((e) => {
            if (fs.lstatSync(joinResultPath(currentPath, e)).isDirectory()) {
                exploreDirectoryTree(joinResultPath(currentPath, e));
            } else if (e.includes('.html')) {
                callback(joinResultPath(currentPath, e).replace('.html', ''));
            }
        });
    }

    exploreDirectoryTree();
}

export { findFiles };
