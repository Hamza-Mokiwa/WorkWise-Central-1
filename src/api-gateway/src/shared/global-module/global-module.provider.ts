export const GlobalModuleProvider = {
  provide: 'GLOBAL_CONFIG',
  useFactory: () => {
    return {
      serverUrl: process.env.ENVIRONMENT == 'dev' ? process.env.DEV_URL : process.env.PROD_URL,
      frontendUrl:
        process.env.ENVIRONMENT == 'dev'
          ? process.env.VITE_ROOT_APPLICATION_DEV
          : process.env.VITE_ROOT_APPLICATION_PROD,
    };
  },
};
