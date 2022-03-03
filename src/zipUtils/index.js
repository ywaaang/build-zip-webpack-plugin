/* eslint-disable prettier/prettier */
const fs = require("fs");
const compressing = require('compressing');
const chalk = require("chalk");

async function writeTempDirectory(files, name ) {
  try {
    const tempPath = name || 'dev'
    if (fs.existsSync(tempPath)) {
      throw new Error(`Folder ${tempPath} already exists`)
    }
    fs.mkdirSync(tempPath)
    files.forEach(file => {
      const rs = fs.createReadStream(file);
      const name = file.replace(/(.*\/)*([^.]+)/i,"$2");
      const ws = fs.createWriteStream(`${tempPath}/${name}`);
      rs.pipe(ws);
    })
    return tempPath;
  } catch (e) {
    throw e.message
  }
}

async function zipDirectory({name, basePath, tempPath, removeOrigin}) {
  try {
    const filename = `${name || 'dev'}.zip`
    await compressing.zip.compressDir(tempPath, filename);
    fs.rmSync(tempPath, {recursive: true});
    if (removeOrigin) {
      fs.rmSync(basePath, {recursive: true});
    }
    console.log(chalk.blue(`Compressed file address: ${filename}`));
    return `${basePath}.${name}`;
  } catch (e) {
    throw e.message
  }
}

module.exports = {
  writeTempDirectory,
  zipDirectory
}