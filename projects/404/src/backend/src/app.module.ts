import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicineModule } from './medicine/medicine.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, MedicineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
