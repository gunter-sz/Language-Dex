import fs from "node:fs";

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

patchAndroidManifest();
