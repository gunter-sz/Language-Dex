import fs from "node:fs";

const signingConfig = `
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (System.getenv("UPLOAD_STORE_FILE") != null) {
                storeFile file(System.getenv("UPLOAD_STORE_FILE"))
                storePassword System.getenv("UPLOAD_STORE_PASSWORD")
                keyAlias System.getenv("UPLOAD_KEY_ALIAS")
                keyPassword System.getenv("UPLOAD_KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
        }
    }\
`;

const filePath = "android/app/build.gradle";
const contents = fs.readFileSync(filePath, "utf8");

// expecting signingConfigs, then buildTypes
const startIndex = /\n *signingConfigs {/.exec(contents)!.index;
const buildTypesIndex = contents.indexOf("buildTypes {");

// find the end of buildTypes
function findBlockEnd(preBlockIndex: number) {
  let blocks = 0;

  for (let i = preBlockIndex; i++; i < contents.length) {
    switch (contents[i]) {
      case "{":
        blocks++;
        break;
      case "}":
        blocks--;

        if (blocks == 0) {
          return i + 1;
        }

        break;
    }
  }

  throw new Error("Failed to find closing bracket in build.gradle before EOF");
}

const endIndex = findBlockEnd(buildTypesIndex);

fs.writeFileSync(
  filePath,
  contents.slice(0, startIndex) + signingConfig + contents.slice(endIndex)
);
