import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongoDBConfig = async (
  config: ConfigService,
): Promise<MongooseModuleOptions> => ({
  uri: config.get('MONGO_DB'),
});
