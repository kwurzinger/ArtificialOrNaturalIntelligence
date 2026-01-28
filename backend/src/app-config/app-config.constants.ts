export const APP_CONFIG = Symbol('APP_CONFIG');

export type AppConfig = {
  baseURL: string;
  port: number;
  staticDir: string;
  staticEndpoint: string;
  docsEndpoint: string;
  pgHost: string;
  pgPort: number;
  pgUsername: string;
  pgPassword: string;
  pgDbname: string;
  adminDefaultUsername: string;
  adminDefaultPassword: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  angularURL: string;
};