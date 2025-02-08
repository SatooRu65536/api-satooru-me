//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-02-08",
  preset: "cloudflare-module",
  storage: {
    kv: {
      driver: "cloudflare-kv-binding",
      binding: "api_satooru_me",
    },
  },
  devStorage: {
    kv: {
      driver: "fs",
      base: "./.tmp/kv",
    },
  },
});
