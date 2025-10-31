# Language Dex

A personal dictionary and language study app.
You can find it on [Google Play](https://play.google.com/store/apps/details?id=dev.arthurcose.languagedex)

## Screenshots

<p align="center">
  <image width="200" src="promo/screenshots/1.png"/>
  <image width="200" src="promo/screenshots/2.png"/>
  <image width="200" src="promo/screenshots/4.png"/>
</p>
<p align="center">
  <image width="200" src="promo/screenshots/3.png"/>
  <image width="200" src="promo/screenshots/5.png"/>
  <image width="200" src="promo/screenshots/6.png"/>
</p>

## Develop

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

1. Install dependencies

```bash
yarn
cd modules/recording-module
yarn
cd ../..

yarn run licenses
```

2. Connect your phone with debugging enabled and start the app

```bash
yarn run android
```

## Build

```bash
yarn run build-android
```

## Structure

- `/app`: Page level components using [file-based routing](https://docs.expo.dev/router/introduction).
- `/lib`: Components and utility files
- `/assets`: App assets (icons, splash screens)
- `/licenses`: Extra license files for license-ripper
- `/scripts`: Tools and build scripts

`@/` in `import` statements point to the project root. (`@/lib` points to `/lib`)
