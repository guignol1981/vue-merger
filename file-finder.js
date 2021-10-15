import fs from 'fs';
import path from 'path';

function findFiles(callback, deep = false) {
    function exploreDirectoryTree(currentPath = path.join(process.cwd())) {
        fs.readdirSync(currentPath).forEach((e) => {
            const filePath = path.join(currentPath, e);

            if (fs.lstatSync(filePath).isDirectory() && !deep) {
                exploreDirectoryTree(filePath);
            } else if (e.includes('.html')) {
                callback(filePath.replace('.html', ''));
            }
        });
    }

    exploreDirectoryTree();
}

export default findFiles;
