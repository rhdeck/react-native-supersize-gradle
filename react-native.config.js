const supersizeGradle = require("./index");
module.exports = {
  commands: [
    {
      name: "supersize-gradle",
      description: "Enhance memory available to gradle",
      options: [
        {
          name: "-j --jvm [memorystring]",
          description: "Gradle JVM Memory module size (default: 2048m)",
          default: "2048m",
        },
        {
          name: "-d --dex [memorystring]",
          description: "Dex compilation memory size (default 3g)",
          default: "3g",
        },
      ],
      func: async (_, __, { jvm, dex }) => {
        console.log("Growing gradle jvm memory setting to ", jvm);
        console.log("Growing dex compilation memory to ", dex);
        await supersizeGradle(jvm, dex);
        console.log("Done enhancing gradle");
      },
    },
  ],
};
