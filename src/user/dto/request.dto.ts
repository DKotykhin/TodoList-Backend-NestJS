import { ApiProperty } from '@nestjs/swagger';

import { Request } from 'express';
import { Types } from 'mongoose';

export class RequestDto extends Request {
  @ApiProperty()
  readonly user: { _id: Types.ObjectId };
}
