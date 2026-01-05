/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_PHONE_NUMBER: string;
  readonly VITE_PASSWORD: string;
  readonly VITE_USERNAME: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
