/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env node, mocha */

const winston = require('winston');
const fs = require('fs-extra');
const { exec } = require('child_process');

const logger = winston.createLogger({
  level: 'silly',
  silent: true,
  format: winston.format.simple(),
  transports: new winston.transports.Console(),
});

module.exports.logger = logger;


const options = {
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  watch: false, // whether to watch the files and rebuild them on change, defaults to
  // process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  target: 'node', // browser/node/electron, defaults to browser
  https: false, // Serve files over https or http, defaults to false
  logLevel: 1, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in
  // minified builds yet)
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times,
  // defaults to false, reports are only printed if watch is disabled
  rootDir: 'test/example',
};

module.exports.options = options;


before('Setting up example directory', function beforeHook(done) {
  // individual timeout for first installation
  this.timeout(60000);

  logger.debug('creating test/example/package.json');
  const package = fs.readJSONSync('./package.json');
  package.devDependencies = package.dependencies;
  package.name += '-test';
  delete package.description;
  // delete package.main;
  package.main = 'test.htl';
  delete package.scripts;
  delete package.repository;
  delete package.dependencies;
  package.devDependencies['@adobe/parcel-plugin-htl'] = 'file:./../..';

  fs.removeSync('./test/example/package-lock.json');
  fs.writeJSONSync('./test/example/package.json', package);

  logger.debug('Resetting dist');
  fs.removeSync('./dist');
  fs.mkdir('./dist');

  logger.debug('Running npm install');
  exec('npm install', { cwd: './test/example' }, (error, stdout, stderr) => {
    if (!error) {
      logger.debug('npm install completed');
      done();
    } else {
      logger.error('npm install failed');
      logger.error(error);
      // eslint-disable-next-line no-console
      console.log(stdout);
      // eslint-disable-next-line no-console
      console.error(stderr);
    }
  });
});


afterEach((done) => {
  logger.debug('Resetting dist');
  // fs.removeSync('./dist');
  // fs.mkdir('./dist');
  done();
});
