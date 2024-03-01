#!/usr/bin/env node

const {glob} = require('glob');
const path = require('path');
const fs = require('fs-extra');
const crypto = require("crypto");

(async () => {
    const appDir = process.cwd();
    const files = await glob('**/*.md', {ignore: 'node_modules/**', cwd: appDir});
    fs.writeJson(path.resolve(appDir, 'manifest.json'), files.map((item) => {
        const md5 = crypto.createHash("md5");
        return {
            id: md5.update(item).digest("hex"), path: '/' + item.split(path.sep).join('/')
        }
    }));
})();
