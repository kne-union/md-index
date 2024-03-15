#!/usr/bin/env node

const {glob} = require('glob');
const path = require('path');
const fs = require('fs-extra');
const crypto = require("crypto");
const last = require('lodash/last');

(async () => {
    const appDir = process.cwd();
    const output = process.env.OUTPUT_PATH || 'build';
    await fs.emptyDir(output);
    const files = await glob('**/*.md', {ignore: 'node_modules/**', cwd: appDir});
    await fs.writeJson(path.resolve(appDir, output, 'manifest.json'), files.map((item) => {
        const md5 = crypto.createHash("md5");
        let filename = path.basename(item, path.extname(item)), author, index = 0;
        const match = filename.match(/\[.+?]/g);
        if (match && /^\[\d+]$/.test(match[0])) {
            filename = filename.replace(match[0], '');
            index = parseInt(match[0].slice(1, -1));
        }
        if (match && last(match) && filename.endsWith(last(match))) {
            filename = filename.replace(last(match), '');
            author = last(match).slice(1, -1);
        }

        return {
            id: md5.update(item).digest("hex"),
            path: '/' + item.split(path.sep).join('/'),
            title: filename,
            author,
            index
        }
    }).sort((a, b) => b.index - a.index));
    await Promise.all(files.map(async (file) => {
        const dir = path.join(output, path.dirname(file));
        await fs.ensureDir(dir);
        await fs.copy(file, path.join(output, file));
    }));
    await fs.exists('assets') && await fs.copy('assets', path.resolve(output, 'assets'));
})();
