import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateMedicineDto,
  ListMedicinesQueryDto,
  UpdateMedicineDto,
} from './create-medicine.dto';
import {
  MedicineListResponse,
  MedicineResponse,
  MedicineService,
} from './medicine.service';

@ApiTags('medicines')
@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  create(@Body() body: CreateMedicineDto): Promise<MedicineResponse> {
    return this.medicineService.create(body);
  }

  @Get()
  findAll(
    @Query() query: ListMedicinesQueryDto,
  ): Promise<MedicineListResponse> {
    return this.medicineService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<MedicineResponse> {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateMedicineDto,
  ): Promise<MedicineResponse> {
    return this.medicineService.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<MedicineResponse> {
    return this.medicineService.remove(id);
  }
}
