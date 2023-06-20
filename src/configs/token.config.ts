import { ConfigService } from '@nestjs/config';

export const tokenConfig = async (config: ConfigService) => ({
  secret: config.get('SECRET_KEY'),
  signOptions: {
    expiresIn: '2d',
  },
});
