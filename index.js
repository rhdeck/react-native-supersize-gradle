const { android } = require("@raydeck/react-native-utilities");
const { join } = require("path");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const growGradle = async (
  jvmSize = "2048m",
  dexSize = "3g",
  path = process.cwd()
) => {
  android.setGradleProperty(
    "org.gradle.jvmargs",
    `-Xmx4g -XX:MaxPermSize=${jvmSize} -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8`,
    path
  );
  //now the hard part
  const appGradlePath = join(android.getAppPath(path), "build.gradle");
  if (!existsSync(appGradlePath))
    throw ("Could not find file: ", appGradlePath);
  const appGradleText = readFileSync(appGradlePath, { encoding: "utf8" });
  const appGradleLines = appGradleText.split("\n");
  const index = appGradleLines.findIndex((l) => l.includes("javaMaxHeapSize"));
  if (index === -1) {
    //need to put in the block
    const androidIndex =
      appGradleLines.findIndex((l) => l.trim().startsWith("android {")) + 1;
    appGradleLines.splice(androidIndex, 0, [
      "dexOptions {",
      `javaMaxHeapSize "${dexSize}"`,
      "}",
    ]);
  } else {
    appGradleLines[index] = `javaMaxHeapSize "${dexSize}"`;
  }
  writeFileSync(appGradlePath, appGradleLines.join("\n"));
};
module.exports = growGradle;
