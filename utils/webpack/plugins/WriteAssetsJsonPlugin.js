import fs from 'fs-extra';
import path from 'path';

/**
 * This plugin is used to write assets.json manually to disk.
 * Since we are using webpack-dev-server for our client assets, the assets.json never got written to disk.
 * The assets.json is needed for SSR.
 * Our options are either doing it this way, or use webpack --watch instead, which will cause ALL outputs to disk, not just assets.json
 * So in this boilerplate I will try using this approach for now.
 * 
 * UPDATE: Apparently there's already a plugin for this, webpack-assets-manifest.
 * So this is plugin will no longer be used.
 * 
 * TODO: Delete this file when ready
 */

class WriteAssetsJsonPlugin {
  constructor({ path = './build/client', filename = 'webpack-assets.json' }) {
    this.path = path;
    this.filename = filename;
  }

  apply(compiler) {
    const afterEmit = (compilation, callback) => {
      if (this.path && this.filename) {
        console.log(`[WriteAssetsJsonPlugin] Writing ${this.filename} file to disk at: ${this.path}`);
        const startTime = new Date().getTime();
        try {
          const stats = compilation.getStats().toJson({
            hash: true,
            publicPath: true,
            assets: true,
            chunks: false,
            modules: false,
            source: false,
            errorDetails: false,
            timings: false
          });

          const { publicPath } = stats;
          const output = {};

          Object.keys(stats.assetsByChunkName).forEach(key => {
            output[key] = {};
            const filename = stats.assetsByChunkName[key];
            const splittedFilename = stats.assetsByChunkName[key].split('.');
            const extension = splittedFilename[splittedFilename.length - 1];

            output[key][extension] = `${publicPath}${filename}`;
          })

          fs.ensureDirSync(this.path);
          fs.writeFileSync(path.resolve(this.path, this.filename), JSON.stringify(output, null, 2));

          console.log(`[WriteAssetsJsonPlugin] Successfully finished! (${new Date().getTime() - startTime}ms)`);

          callback();
        } catch (err) {
          throw new Error(`[WriteAssetsJsonPlugin] An error occured!`, err);
        }
      }
    }

    if (compiler.hooks) {
      var plugin = { name: 'WriteAssetsJsonPlugin' }

      compiler.hooks.afterEmit.tapAsync(plugin, afterEmit)
    } else {
      compiler.plugin('after-emit', afterEmit)
    }

  }
}

export default WriteAssetsJsonPlugin;
