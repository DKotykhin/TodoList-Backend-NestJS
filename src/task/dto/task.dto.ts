import { Schema, Types } from 'mongoose';
import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ minimum: 2 })
  @IsString({ message: 'Title must be a string' })
  @Length(2, 30, { message: 'Title must be between 2 and 30 characters' })
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

  @ApiProperty()
  readonly updatedAt: Schema.Types.Date;

  @ApiPropertyOptional()
  readonly completedAt: Schema.Types.Date;
}
