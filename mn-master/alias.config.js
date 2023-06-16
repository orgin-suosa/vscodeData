const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      'mn-template': resolve('node_modules/@manniu-cli/vue-cli-plugin-manniu-cli-plugin/core/src')
    }
  }
};
