import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicineModule } from './medicine/medicine.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule,MedicineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
