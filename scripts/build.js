import webpack from 'webpack';
import path from 'path';
import appRootDir from 'app-root-dir';
import fs from 'fs-extra';

const logError = require('debug')('build:error');
const logSuccessError = require('debug')('build:success:error');
const logSuccessWarning = require('debug')('build:success:warning');

logError.color = 1;
logSuccessError.color = 5;
logSuccessWarning.color = 3;

const dir = process.env.DIR;

if (!dir) {
  console.error('DIR not defined.');
  console.error('DIR is the path to the directory you want to build.');
  console.error('The path should contain a webpack.config.babel.js file.');
  console.error('Exiting...');

  process.exit(1);
}

const buildPath = path.join(appRootDir.get(), './build', dir);
const webpackConfig = require(path.join(appRootDir.get(), dir, './webpack.config.babel.js')).default;

/**
 * Make sure the build path exists
 */
fs.ensureDirSync(buildPath);

const build = () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        logError(err.stack || err);

        if (err.details) {
          logError(err.details);
        }

        reject(err);
      } else {
        const info = stats.toJson();

        if (stats.hasErrors()) {
          logSuccessError(info.errors);
        }

        if (stats.hasWarnings()) {
          logSuccessWarning(info.warnings);
        }

        resolve();
      }
    });
  });
};

export default build;
