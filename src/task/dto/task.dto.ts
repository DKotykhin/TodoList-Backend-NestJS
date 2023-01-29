import { Schema, Types } from 'mongoose';
import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ minimum: 2 })
  readonly title: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly subtitle: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly description: string;

  @ApiPropertyOptional()
  @IsOptional()
  readonly deadline: Schema.Types.Date;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  readonly completed: boolean;
}

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty()
  readonly _id: Types.ObjectId;
}

export class TaskDto extends UpdateTaskDto {
  @ApiProperty()
  readonly createdAt: Schema.Types.Date;
}
