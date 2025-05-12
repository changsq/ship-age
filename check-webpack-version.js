try {
    const webpack = require('webpack');
    console.log(`Webpack version: ${webpack.version}`);
  } catch (error) {
    console.error("Webpack is not installed or there's an issue with the installation.");
  }