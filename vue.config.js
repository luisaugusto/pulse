module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    // workboxPluginMode: "InjectManifest",
    // workboxOptions: {
    //   swSrc: "src/service-worker.js"
    // },
    name: "Pulse",
    themeColor: "#212121",
    msTileColor: "#212121",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      background_color: "#212121",
      version: "1.1.2"
    }
  }
};
