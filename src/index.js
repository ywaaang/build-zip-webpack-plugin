const path = require("path");
const golb = require("glob");
const chalk = require("chalk");
const { writeTempDirectory, zipDirectory } = require("./zipUtils");
const UserHook = require("./hook");

class ZipFilePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const zipHook = new UserHook(compiler);
    zipHook.addSyncHook("zipDone", ["url"])
    compiler.hooks.afterEmit.tapAsync("zip-file-plugin", async (compilation) => {
      try {
        const options = this.options
        const basePath = options.path || compilation.outputOptions.path;
        console.log(chalk.green('Start finding files'));
        const files = golb.sync(
          path.join(basePath, `./*.*`)
        );
        console.log(chalk.blue(`A total of ${chalk.red(files.length)} files were found`));
        console.log(chalk.green('Start compressing folder'));
        const tempPath = await writeTempDirectory(files, options.name);
        const zipUrl = await zipDirectory({ ...options, tempPath, basePath: basePath });
        console.log(chalk.green('Compression complete'));
        zipHook.emitHook("zipDone", [zipUrl])
      } catch (err) {
        console.log(chalk.red(err));
      }
    });
  }
}

module.exports = ZipFilePlugin;
