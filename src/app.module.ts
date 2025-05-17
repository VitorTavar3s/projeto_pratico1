import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
