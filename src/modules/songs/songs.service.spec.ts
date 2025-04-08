import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { FindOneOptions, In, Repository } from 'typeorm';
import { Song } from './entities/songs.entity';
import { Artist } from '../artists/entities/artists.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';

describe('SongsService', () => {
  let service: SongsService;
  let songRepo: Repository<Song>;
  let artistRepo: Repository<Artist>;

  const oneSong = {
    title: 'You for Me 3',
    artists: [1, 2, 5],
    releasedDate: new Date(),
    duration: new Date(),
    lyrics: "Sby, you're my adrenaline.",
    favorite: 'No',
  };

  const songArray = [
    {
      title: 'You for Me 3',
      artists: [1, 2, 5],
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: "Sby, you're my adrenaline.",
    },
    {
      title: 'Time of my life',
      artists: [2, 5, 9],
      releasedDate: new Date(),
      duration: new Date(),
      lyrics: 'Hey, its the time of my life',
    },
  ];

  const artist = [1, 2, 5];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest
              .fn()
              .mockImplementation(() => Promise.resolve(songArray)),
            findOne: jest.fn().mockImplementation((options: FindOneOptions) => {
              return Promise.resolve(oneSong);
            }),
            create: jest
              .fn()
              .mockImplementation((createSongDto: CreateSongDTO) => {
                return Promise.resolve(oneSong);
              }),
            save: jest.fn().mockResolvedValue(oneSong),
            update: jest
              .fn()
              .mockImplementation((id: number, updatedSong: UpdateSongDto) => {
                return Promise.resolve(oneSong);
              }),
            delete: jest.fn().mockImplementation((id: number) => {
              return Promise.resolve({ affected: 1 });
            }),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findBy: jest.fn().mockImplementation(() => Promise.resolve(artist)),
          },
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    artistRepo = module.get<Repository<Artist>>(getRepositoryToken(Artist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should give me the song by id', async () => {
    const song = await service.findById(1);
    const repoSpy = jest.spyOn(songRepo, 'findOne');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['artists'],
    });
  });

  it('should create the song', async () => {
    const song = await service.create(oneSong);
    const songRepoSpy = jest.spyOn(songRepo, 'save');
    const artistReopSpy = jest.spyOn(artistRepo, 'findBy');
    expect(song).toEqual(oneSong);
    expect(artistReopSpy).toHaveBeenCalledWith({
      id: In([1, 2, 5]),
    });
    expect(songRepoSpy).toHaveBeenCalledWith(oneSong);
    //If i used the repo.create method
    //expect(songRepo.create).toHaveBeenCalledTimes(1);
    //expect(songRepo.create).toHaveBeenCalledWith(oneSong);
  });

  it('should update the song', async () => {
    const song = await service.update(1, oneSong);
    const repoSpy = jest.spyOn(songRepo, 'update');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith(1, oneSong);
    expect(songRepo.update).toHaveBeenCalledTimes(1);
  });

  it('should delete the song', async () => {
    const song = await service.delete(1);
    const repoSpy = jest.spyOn(songRepo, 'delete');
    expect(songRepo.delete).toHaveBeenCalledTimes(1);
    expect(song.affected).toBe(1);
    expect(repoSpy).toHaveBeenCalledWith(1);
  });
});
