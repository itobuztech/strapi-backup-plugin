import { Strapi } from '@strapi/strapi';
var fs = require('fs');
import {execSync} from 'child_process';
import path from 'path';
import tar from 'tar';
import { homedir } from 'os';

export default ({ strapi }: { strapi: Strapi }) => ({
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
      const backupFileName = body.data.name ? `${body.data.name}-${Date.now()}`: `export_${Date.now()}`;
      
      const fileNameFolder = `${directoryPath}/${backupFileName}`;

      fs.mkdirSync(`${fileNameFolder}`);

      execSync(`npm run strapi export -- --no-encrypt --file public/downloads/backupfiles/${backupFileName}/${backupFileName}`, { encoding: 'utf-8' });

      let fileName = `./public/downloads/backupfiles/${backupFileName}/${backupFileName}.tar.gz`;
  
      if (fileName) {
        try {
          fs.chmodSync(`${fileName}`, 0o444); 
        } catch (error) {
          return {errMsg: "Something went wrong in file access!", status:404, error}
        }
      }

      fs.mkdirSync(`${fileNameFolder}/source`);
      fs.cpSync('src', `${fileNameFolder}/source`, { recursive: true });

      let configFiles = fs.readdirSync('config');
      configFiles.forEach((file:string) => {
        if (file==='database.js') {
          execSync(`rsync -a --exclude='database.js' 'config' ${fileNameFolder} `);
        }
  
        if (file === 'database.ts') {
          execSync(`rsync -a --exclude='database.ts' 'config' ${fileNameFolder}`);
        }
      });

      return this.zip(backupFileName);
     }catch (err) {
       return { status: 505, err};
     }
  },

  zip(backupFileName:string){
   return tar.create(
      {
        gzip: true,
        file: `public/downloads/backupfiles/${backupFileName}.zip`,
        cwd: `public/downloads/backupfiles`
      },
      [backupFileName]
    ).then(() => {      
      fs.rmSync(path.resolve(`public/downloads/backupfiles/${backupFileName}`), {recursive: true});
      return JSON.stringify({msg: 'Success', file: `${backupFileName}.zip`, status: 200});
    });
  },

  async listFiles(){
    const folderPath = './public/downloads/backupfiles';
    return fs.readdirSync(folderPath, { recursive: true });
  },

  async listFilesWithDetails(){
    const folderPath = './public/downloads/backupfiles';

    if (fs.existsSync(folderPath)) {
      return await fs.readdirSync(folderPath).map((file:any)=>{
        const filePath = `${folderPath}/${file}`;
        const stats = fs.statSync(filePath);
  
        const fileDetails = {
          name: path.basename(filePath),
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
  
        return fileDetails;
      });
    }

    return JSON.stringify([]);
  },
  
  async delete(name:string){
    const filePath = `public/downloads/backupfiles/${name}`;
    
    try {
      fs.unlinkSync(filePath);
      return {message: 'File deleted successfully', status: 200};
    } catch (error) {
      return {errorMsg: 'Error deleting the file', status: 500, error};
    } 
  },

  async download(name:string){
    try {
      const filePath = `public/downloads/backupfiles/${name}`;
      const data = fs.readFileSync(filePath);
      
      return JSON.stringify(data);
    } catch (error) {
      return {errorMsg: 'Error downloading the file', status: 500, error};
    } 
    
  },
 
  async restore(zippedFile:string){
    const fileSplitedParts = zippedFile.split('.');
    const fileName = fileSplitedParts[0];
    const dataFile = `${fileName}.tar.gz`;
    const filePath = `public/restored/${zippedFile}`;
    const directoryPath = `./public/restored`;
    const userHomeDir = homedir();

    if (fileSplitedParts[1]!=='zip') {
      return JSON.stringify({errMsg: 'This is not a zip file!', status: 404});
    }

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    try {
      fs.accessSync('public/restored', fs.constants.W_OK);
    } catch (err) { 
      return JSON.stringify({errMsg: "'public/restored' is not writable!", err});
    } 

    try {
      fs.copyFileSync(`${userHomeDir}/Downloads/${zippedFile}`, `${filePath}`);
    } catch (err) {
      return JSON.stringify({errMsg: "File not found!", status: 404, err});
    }
    
    try {
     return tar.extract({
        f: `${filePath}`,
        cwd: `public/restored`
      }).then(()=>{
        try {     
          const execSync = require('child_process').execSync;

          fs.cpSync(`public/restored/${fileName}/config`, `config`, { recursive: true });

          execSync(`rsync -a --exclude='strapi-backup-plugin' 'public/restored/${fileName}/source/' 'src'`);

          fs.rmSync(path.resolve(`public/restored/${fileName}/source`), {recursive: true});
          
          const output =  execSync(`npm run strapi import -- -f public/restored/${fileName}/${dataFile} --force`);
     
          const result = output ? { message : "Data imported successfully!", status: 200 } : { errorMsg : "Data could not be imported!", status: 404 };

          // execSync('npm run build', {cwd: `src/plugins/strapi-backup-plugin`});

          return JSON.stringify(result);
        } catch (err) {
          return JSON.stringify({errMsg: 'No such file', status: 505, err});
        }
      });
    } catch (err) {
      return JSON.stringify({errMsg: "Something went wrong!", status: 505, err});
    }
  }
});
