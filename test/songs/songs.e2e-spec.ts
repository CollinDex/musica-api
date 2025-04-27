import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SongsModule } from 'src/modules/songs/songs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDataSourceOptions } from 'src/db/test-data-source';
import { CreateSongDTO } from 'src/modules/songs/dto/create-song-dto';
import { Song } from 'src/modules/songs/entities/songs.entity';
import { clearDatabase } from '../utils/clearDatabase';
import { DataSource } from 'typeorm';
import { UpdateSongDto } from 'src/modules/songs/dto/update-song-dto';

describe('Songs Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SongsModule, TypeOrmModule.forRoot(testDataSourceOptions)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    //const songRepo = app.get('SongRepository');
    //await songRepo.clear();
    const dataSource = app.get(DataSource);
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  const oneSong = {
    title: 'You for Me 3',
    artists: [1, 2, 5],
    releasedDate: new Date(),
    duration: new Date(),
    lyrics: "Sby, you're my adrenaline.",
    favorite: 'No',
  };

  const updatedSong = {
    title: 'Show me the way',
    lyrics: "Sby, you're my adrenaline.",
    favorite: 'No',
  };

  const songObject = (song) => {
    return {
      title: song.title,
      lyrics: song.lyrics,
      favorite: song.favorite,
      artists: expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2 }),
        expect.objectContaining({ id: 3 }),
      ]),
    };
  };

  const createSong = (createSongDTO: CreateSongDTO): Promise<Song> => {
    const songRepo = app.get('SongRepository');
    const song = songRepo.create(createSongDTO);
    return songRepo.save(song);
  };

  it(`/GET songs`, async () => {
    const newSong = await createSong(oneSong);
    const results = await request(app.getHttpServer()).get('/songs');
    expect(results.statusCode).toBe(200);
    expect(results.body.items).toHaveLength(1);
    expect(results.body.items).toMatchObject([songObject(oneSong)]);
  });

  it('/GET songs/:id', async () => {
    const newSong = await createSong(oneSong);
    const results = await request(app.getHttpServer()).get(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body).toMatchObject(songObject(oneSong));
  });

  it('/PUT songs/:id', async () => {
    const newSong = await createSong(oneSong);
    const updateSongDTO: Partial<UpdateSongDto> = updatedSong;
    const results = await request(app.getHttpServer())
      .put(`/songs/${newSong.id}`)
      .send(updateSongDTO as UpdateSongDto);
    expect(results.statusCode).toBe(200);
    expect(results.body).toMatchObject(songObject(updatedSong));
  });

  it('/DELETE songs/:id', async () => {
    const createSongDTO: CreateSongDTO = oneSong;
    const newSong = await createSong(createSongDTO);
    const results = await request(app.getHttpServer()).delete(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body.affected).toBe(1);
  });
});
