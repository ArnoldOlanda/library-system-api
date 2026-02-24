import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sequence } from './secuence.entity';
import { SecuencesService } from './secuences.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sequence]),
    ],
    exports: [TypeOrmModule],
    providers: [SecuencesService],
})
export class SecuencesModule {}
