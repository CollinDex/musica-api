import { DataSource } from 'typeorm';

export const clearDatabase = async (dataSource: DataSource) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    // Disable foreign key constraints
    await queryRunner.query('SET session_replication_role = replica;');

    // Truncate in dependency-safe order
    await queryRunner.query(`TRUNCATE TABLE songs_artists RESTART IDENTITY CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE songs RESTART IDENTITY CASCADE`);
    await queryRunner.query(`TRUNCATE TABLE artists RESTART IDENTITY CASCADE`);

    // Re-enable constraints
    await queryRunner.query('SET session_replication_role = DEFAULT;');

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
