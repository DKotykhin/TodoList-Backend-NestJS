import { Request } from 'express';
import { Types } from 'mongoose';

export class RequestDto extends Request {
  readonly userId: Types.ObjectId;
}
