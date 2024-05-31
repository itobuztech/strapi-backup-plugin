"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const tar_1 = __importDefault(require("tar"));
const os_1 = require("os");
exports.default = ({ strapi }) => ({
    getWelcomeMessage() {
        return 'Welcome to Strapi-Backup-plugin 🚀';
    },
    async create(body) {
        try {
            const directoryPath = 'public/downloads/backupfiles';
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            fs.accessSync('public/downloads/backupfiles', fs.constants.W_OK);
            const backupFileName = body.data.name ? `${body.data.name}-${Date.now()}` : `export_${Date.now()}`;
            const fileNameFolder = `${directoryPath}/${backupFileName}`;
            fs.mkdirSync(`${fileNameFolder}`);
            (0, child_process_1.execSync)(`npm run strapi export -- --no-encrypt --file public/downloads/backupfiles/${backupFileName}/${backupFileName}`, { encoding: 'utf-8' });
            let fileName = `./public/downloads/backupfiles/${backupFileName}/${backupFileName}.tar.gz`;
            if (fileName) {
                try {
                    fs.chmodSync(`${fileName}`, 0o444);
                }
                catch (error) {
                    return { errMsg: "Something went wrong in file access!", status: 404, error };
                }
            }
            fs.mkdirSync(`${fileNameFolder}/source`);
            fs.cpSync('src', `${fileNameFolder}/source`, { recursive: true });
            let configFiles = fs.readdirSync('config');
            configFiles.forEach((file) => {
                if (file === 'database.js') {
                    (0, child_process_1.execSync)(`rsync -a --exclude='database.js' 'config' ${fileNameFolder} `);
                }
                if (file === 'database.ts') {
                    (0, child_process_1.execSync)(`rsync -a --exclude='database.ts' 'config' ${fileNameFolder}`);
                }
            });
            return this.zip(backupFileName);
        }
        catch (err) {
            return { status: 505, err };
        }
    },
    zip(backupFileName) {
        return tar_1.default.create({
            gzip: true,
            file: `public/downloads/backupfiles/${backupFileName}.zip`,
            cwd: `public/downloads/backupfiles`
        }, [backupFileName]).then(() => {
            fs.rmSync(path_1.default.resolve(`public/downloads/backupfiles/${backupFileName}`), { recursive: true });
            return JSON.stringify({ msg: 'Success', file: `${backupFileName}.zip`, status: 200 });
        });
    },
    async listFilesWithDetails() {
        const folderPath = './public/downloads/backupfiles';
        if (fs.existsSync(folderPath)) {
            return await fs.readdirSync(folderPath).map((file) => {
                const filePath = `${folderPath}/${file}`;
                const stats = fs.statSync(filePath);
                const fileDetails = {
                    name: path_1.default.basename(filePath),
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
                return fileDetails;
            });
        }
        return JSON.stringify([]);
    },
    async delete(name) {
        const filePath = `public/downloads/backupfiles/${name}`;
        try {
            fs.unlinkSync(filePath);
            return { message: 'File deleted successfully', status: 200 };
        }
        catch (error) {
            return { errorMsg: 'Error deleting the file', status: 500, error };
        }
    },
    async download(name) {
        try {
            const filePath = `public/downloads/backupfiles/${name}`;
            const data = fs.readFileSync(filePath);
            return JSON.stringify(data);
        }
        catch (error) {
            return { errorMsg: 'Error downloading the file', status: 500, error };
        }
    },
    async restore(zippedFile) {
        const fileSplitedParts = zippedFile.split('.');
        const fileName = fileSplitedParts[0];
        const dataFile = `${fileName}.tar.gz`;
        const filePath = `public/restored/${zippedFile}`;
        const directoryPath = `./public/restored`;
        const userHomeDir = (0, os_1.homedir)();
        if (fileSplitedParts[1] !== 'zip') {
            console.log({ errMsg: 'Invalid file type!', status: 403 });
            return JSON.stringify({ errMsg: 'Invalid file type!', status: 403 });
        }
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        try {
            fs.accessSync('public/restored', fs.constants.W_OK);
        }
        catch (err) {
            return JSON.stringify({ errMsg: "'public/restored' is not writable!", err, status: 404 });
        }
        try {
            fs.copyFileSync(`${userHomeDir}/Downloads/${zippedFile}`, `${filePath}`);
        }
        catch (err) {
            return JSON.stringify({ errMsg: "File not found!", status: 404, err });
        }
        try {
            await tar_1.default.extract({
                f: `${filePath}`,
                cwd: `public/restored`
            });
            const execSync = require('child_process').execSync;
            fs.cpSync(`public/restored/${fileName}/config`, `config`, { recursive: true });
            execSync(`rsync -a --exclude='strapi-backup-plugin' 'public/restored/${fileName}/source/' 'src'`);
            fs.rmSync(path_1.default.resolve(`public/restored/${fileName}/source`), { recursive: true });
            const output = execSync(`npm run strapi import -- -f public/restored/${fileName}/${dataFile} --force`);
            const result = output ? { message: "Data imported successfully!", status: 200 } : { errorMsg: "Data could not be imported!", status: 404 };
            fs.rmSync(path_1.default.resolve(`public/restored/${fileName}`), { recursive: true });
            // execSync('npm run build', {cwd: `src/plugins/strapi-backup-plugin`}); // not applicable if the plugin is downloaded in 'node_modules' as npm package.
            return JSON.stringify(result);
        }
        catch (err) {
            console.log({ errMsg: "Unrecognized archive format!", status: 505, err });
            fs.unlinkSync(`public/restored/${zippedFile}`);
            return JSON.stringify({ errMsg: "Unrecognized archive format!", status: 505, err });
        }
    }
});
