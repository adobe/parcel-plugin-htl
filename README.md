# Parcel Plugin HTL

This is a plugin for Parcel which compiles `*.htl` (i.e. Sightly) templates into `dist/*.js` output. 

## Status
[![codecov](https://img.shields.io/codecov/c/github/adobe/parcel-plugin-htl.svg)](https://codecov.io/gh/adobe/parcel-plugin-htl)
[![CircleCI](https://img.shields.io/circleci/project/github/adobe/parcel-plugin-htl.svg)](https://circleci.com/gh/adobe/parcel-plugin-htl)
[![GitHub license](https://img.shields.io/github/license/adobe/parcel-plugin-htl.svg)](https://github.com/adobe/parcel-plugin-htl/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/adobe/parcel-plugin-htl.svg)](https://github.com/adobe/parcel-plugin-htl/issues)
[![npm](https://img.shields.io/npm/dw/@adobe/parcel-plugin-htl.svg)](https://www.npmjs.com/package/@adobe/parcel-plugin-htl)

[![Greenkeeper badge](https://badges.greenkeeper.io/adobe/parcel-plugin-htl.svg)](https://greenkeeper.io/)


## Usage

Add `@adobe/parcel-plugin-htl` to your `devDependencies` and then run

```bash
npx parcel build src/*.htl --target node
```

> **Note**: due to a [bug](https://github.com/parcel-bundler/parcel/issues/1632) in the parcel bundler, the `--target node` option is required.
