import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from '../../user/dto/user-response.dto';

export class AuthResponseDto extends UserResponseDto {
  @ApiProperty()
  readonly token: string;
}
