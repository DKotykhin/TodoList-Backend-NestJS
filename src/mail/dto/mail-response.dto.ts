import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;
}
