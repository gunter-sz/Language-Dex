import fs from "node:fs";
import packageMeta from "../package.json";

function patchBuildGradle() {
  const path = "./android/app/build.gradle";
  let data = fs.readFileSync(path, "utf8");

  function patch(name: string, value: string) {
    const start = data.indexOf(name);
    const end = data.indexOf("\n", start);
    data = data.slice(0, start) + name + " " + value + data.slice(end);
  }

  patch("versionCode", JSON.stringify(packageMeta.versionCode));
  patch("versionName", JSON.stringify(packageMeta.version));

  fs.writeFileSync(path, data);
}

function patchAndroidManifest() {
  // strip metadata for com.google.android.gms.ads, since it seems to duplicate
  const path = "./android/app/src/main/AndroidManifest.xml";
  let data = fs.readFileSync(path, "utf8");

  while (true) {
    const startIndex = data.indexOf(
      '\n    <meta-data android:name="com.google.android.gms.ads'
    );

    if (startIndex == -1) {
      break;
    }

    const endIndex = data.indexOf("\n", startIndex + 1);
    data = data.slice(0, startIndex) + data.slice(endIndex);
  }

  fs.writeFileSync(path, data);
}

patchBuildGradle();
patchAndroidManifest();
