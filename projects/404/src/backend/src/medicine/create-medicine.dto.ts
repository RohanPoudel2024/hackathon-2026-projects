import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MedicineCategory, MedicineForm } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ example: 'Paracetamol 500mg' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiProperty({ enum: MedicineForm, example: MedicineForm.TABLET })
  @IsEnum(MedicineForm)
  form!: MedicineForm;

  @ApiPropertyOptional({
    enum: MedicineCategory,
    example: MedicineCategory.OTC,
  })
  @IsOptional()
  @IsEnum(MedicineCategory)
  category?: MedicineCategory;

  @ApiPropertyOptional({ example: 'N02BE01' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  rxnormCode?: string;

  @ApiPropertyOptional({ example: 'Analgesic' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  drugClass?: string;

  @ApiPropertyOptional({ example: 'Pain reliever and fever reducer.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  description?: string;

  @ApiPropertyOptional({ example: 'Acme Pharma' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  manufacturer?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/medicine/paracetamol.png',
  })
  @IsOptional()
  @IsUrl()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  imageUrl?: string;
}

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {}

export class ListMedicinesQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ example: 'para' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  search?: string;
}
