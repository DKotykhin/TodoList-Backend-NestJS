import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum SortField {
  createdAt = 'createdAt',
  deadline = 'deadline',
  title = 'title',
}

enum SortOrder {
  asc = '-1',
  desc = '1',
}
export class QueryDto {
  @ApiPropertyOptional({ description: 'task amount on page', default: 6 })
  @IsOptional()
  readonly limit: string;

  @ApiPropertyOptional({ description: 'page number', default: 1 })
  @IsOptional()
  readonly page: string;

  @ApiPropertyOptional({ description: 'tab number', default: 0 })
  @IsOptional()
  readonly tabKey: string;

  @ApiPropertyOptional({ enum: SortField, default: 'createdAt' })
  @IsOptional()
  readonly sortField: SortField;

  @ApiPropertyOptional({ enum: SortOrder, default: '-1' })
  @IsOptional()
  readonly sortOrder: SortOrder;

  @ApiPropertyOptional()
  @IsOptional()
  readonly search: string;
}
