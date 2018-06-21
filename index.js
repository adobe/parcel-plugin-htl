module.exports = bundler => {
    // process HTL files by .htl extension
    bundler.addAssetType('htl', require.resolve('./HTLAsset'));
};