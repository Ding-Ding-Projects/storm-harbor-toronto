import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ca.stormharbor.toronto',
  appName: 'Storm Harbor Toronto',
  webDir: 'dist',
  server: { androidScheme: 'https' }
};

export default config;
