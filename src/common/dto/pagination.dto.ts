import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  //@Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  limit?: number;

  //@Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  offset?: number;
}
