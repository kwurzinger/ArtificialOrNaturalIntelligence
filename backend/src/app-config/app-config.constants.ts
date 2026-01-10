export const APP_CONFIG = Symbol('APP_CONFIG');

export type AppConfig = {
  baseURL: string;
  port: number;
  staticDir: string;
  staticEndpoint: string;
  docsEndpoint: string;
};