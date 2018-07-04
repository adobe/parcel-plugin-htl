# Parcel Plugin HTL

This is a plugin for Parcel which compiles `*.htl` (i.e. Sightly) templates into `dist/*.js` output. 

## Status

[![GitHub issues](https://img.shields.io/github/issues/adobe/parcel-plugin-htl.svg?style=for-the-badge)](https://github.com/adobe/parcel-plugin-htl/issues)
[![GitHub license](https://img.shields.io/github/license/adobe/parcel-plugin-htl.svg)](https://github.com/adobe/parcel-plugin-htl/blob/master/LICENSE.txt)
[![CircleCI](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg?style=for-the-badge)](https://circleci.com/gh/adobe/parcel-plugin-htl)

## Usage

Add `@adobe/parcel-plugin-htl` to your `devDependencies` and then run

```bash
npx parcel build src/*.htl --target node
```

> **Note**: due to a [bug](https://github.com/parcel-bundler/parcel/issues/1632) in the parcel bundler, the `--target node` option is required.
