import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { MedicineModule } from './medicine/medicine.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, SpecializationsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
