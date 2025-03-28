import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedData } from 'db/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const querRunner = this.connection.createQueryRunner();

    await querRunner.connect();
    await querRunner.startTransaction();

    try {
      console.info('Data seeding started');
      const manager = querRunner.manager;
      await seedData(manager);
      await querRunner.commitTransaction();
    } catch (error) {
      console.log('Error during database seeding:', error);
      await querRunner.rollbackTransaction();
    } finally {
      await querRunner.release();
      console.info('Data seeding finished succesfully');
    }
  }
}
