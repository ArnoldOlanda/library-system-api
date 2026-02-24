import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sequence } from './secuence.entity';

@Injectable()
export class SecuencesService {

    constructor(
        private readonly dataSource: DataSource,
    ){}

    async getNextCorrelative(documentType: string): Promise<string> {
    return await this.dataSource.transaction(async (manager) => {
        const sequence = await manager.findOne(Sequence, {
        where: { documentType },
        lock: { mode: 'pessimistic_write' }, // evita condición de carrera
        });

        if (!sequence) throw new Error(`Sequence not found for type: ${documentType}`);

        sequence.currentNumber += 1;
        await manager.save(sequence);

        const number = String(sequence.currentNumber).padStart(sequence.padding, '0');
        return `${sequence.prefix}${number}`; // ej: NV-000000001
    });
}
}
