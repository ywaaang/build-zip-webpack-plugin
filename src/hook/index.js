/* eslint-disable prettier/prettier */
const SyncHooks = require('tapable').SyncHook;

class SyncHook {
  constructor(compiler) {
    this.compiler = compiler;
  }

  addSyncHook(hookName, params = []) {
    if (this.isHookExistence(hookName)) throw new Error("Hook already exists")
    const newHook = new SyncHooks(params);
    this.compiler.hooks[hookName] = newHook;
  }

  emitHook(hookName, params) {
    if (!this.isHookExistence(hookName)) throw new Error("Hook does not exist")
    this.compiler.hooks[hookName].call(...params);
  }

  isHookExistence(hookName) {
    return this.compiler.hooks[hookName]
  }
}

module.exports = SyncHook;
