#!/usr/bin/env node

const {glob} = require('glob');
const path = require('path');
const {v4: uuidv4} = require('uuid');
const fs = require('fs-extra');

(async () => {
    const appDir = process.cwd();
    const files = await glob('**/*.md', {ignore: 'node_modules/**', cwd: appDir});
    fs.writeJson(path.resolve(appDir, 'manifest.json'), files.map((item) => {
        return {
            id: uuidv4(), path: item.split(path.sep).join('/')
        }
    }));
})();
