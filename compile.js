qx.Class.define("qxl.apiviewer.compile.CompilerApi", {
  extend: qx.tool.cli.api.CompilerApi,

  members: {
    async load() {
      this.addListener("changeCommand", function () {
        let command = this.getCommand();
        if (command instanceof qx.tool.cli.commands.Test) {
          command.addListener("runTests", this.__appTesting, this);
          if (command.setNeedsServer) {
            command.setNeedsServer(true);
          }
        }
      }, this);
      return this.base(arguments);
    },

    // Test application in headless Chrome and Firefox
    __appTesting: async function (data) {
      let result = data.getData ? data.getData() : {};
      const createTestCafe = this.require('testcafe');
      const testcafe = await createTestCafe('localhost');
      try {
        const runner = testcafe.createRunner();
        const failedCount = await runner
          .src(['tests/testcafe.js'])
          .browsers(['chrome:headless', 'firefox:headless'])
          .run();
        console.log('Tests failed: ' + failedCount);
        result.setExitCode(failedCount);
      }
      finally {
        await testcafe.close();
      }
    }
  }
});

module.exports = {
  CompilerApi: qxl.apiviewer.compile.CompilerApi
};
