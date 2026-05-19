import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  override: {
    // Configuración para Cloudflare Workers
    queue: false,
    cache: false,
  },
};

export default config;