export default {
  name: "GoodFilms",
  slug: "goodfilms",
  version: "1.0.0",
  orientation: "portrait",
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true
  },
  android: {
    package: "com.oliverhhh.goodfilms",
    versionCode: 1
  },
  extra: {
    eas: {
      projectId: "4a948a94-b0c4-4556-8ed3-1e51aacba0d3"
    }
  }
};
