# Parcel Plugin HTL

This is a plugin for Parcel which compiles `*.htl` (i.e. Sightly) templates into `dist/*.js` output. 

## Usage

Add `@adobe/parcel-plugin-htl` to your `devDependencies` and then run

```bash
npx parcel build src/*.htl --target node
```

> **Note**: due to a [bug](https://github.com/parcel-bundler/parcel/issues/1632) in the parcel bundler, the `--target node` option is required.
