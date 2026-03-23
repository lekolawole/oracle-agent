export interface IEnvironment {
  apiUrl: string
}

import { DEV_ENVIRONMENT } from "./environment.dev"
import { PROD_ENVIRONMENT } from "./environment.prod"

const ENV = process.env.APP_ENV || 'development';

const configs = {
  development: DEV_ENVIRONMENT,
  production: PROD_ENVIRONMENT
}

export default configs[ENV as keyof typeof configs] ?? DEV_ENVIRONMENT;