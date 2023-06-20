import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const tokenConfig = async (
  config: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: config.get('SECRET_KEY'),
  signOptions: {
    expiresIn: '2d',
  },
});
