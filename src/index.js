const path = require("path");
const golb = require("glob");
const chalk = require("chalk");
const ora = require("ora");
const spinner = ora({
  color: 'green'
})
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
        spinner.start();
        const files = golb.sync(
          path.join(basePath, `./*.*`)
        );
        console.log(chalk.blue(`A total of ${chalk.red(files.length)} files were found`));
        spinner.stop();
        console.log(chalk.green('Start compressing folder'));
        spinner.start();
        const tempPath = await writeTempDirectory(files, options.name);
        const zipUrl = await zipDirectory({ ...options, tempPath, basePath: basePath });
        console.log(chalk.green('Compression complete'));
        spinner.stop();
        zipHook.emitHook("zipDone", [zipUrl])
      } catch (err) {
        console.log(chalk.red(err));
        spinner.stop();
      }
    });
  }
}

module.exports = ZipFilePlugin;
