import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  readonly limit: string;

  @IsOptional()
  readonly page: string;

  @IsOptional()
  readonly tabKey: string;

  @IsOptional()
  readonly sortField: string;

  @IsOptional()
  readonly sortOrder: string;

  @IsOptional()
  readonly search: string;
}
