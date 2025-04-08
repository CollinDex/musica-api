import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        SongsService,
        {
          provide: SongsService,
          useValue: {
            paginate: jest
              .fn()
              .mockResolvedValue([{ id: '123131', title: 'Dancing Queen' }]),
            findById: jest
              .fn()
              .mockResolvedValue({ id: '23243', title: 'Maguerita' }),
            create: jest
              .fn()
              .mockImplementation((createSongDto: CreateSongDTO) => {
                return Promise.resolve({
                  id: 'a uuid',
                  ...createSongDto,
                });
              }),
            update: jest
              .fn()
              .mockImplementation((updateSong: UpdateSongDto) => {
                return Promise.resolve({
                  affected: 1,
                });
              }),
            delete: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({
                affected: 1,
              });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of songs', async () => {
      const songs = await controller.findAll();
      expect(songs).toEqual([{ id: '123131', title: 'Dancing Queen' }]);
    });
  });

  describe('findById', () => {
    it('should return a single song with matching id', async () => {
      const song = await controller.findById(23243);
      expect(song).toEqual({ id: '23243', title: 'Maguerita' });
    });
  });

  describe('createSong', () => {
    it('should create a new song', async () => {
      const createSongDto: CreateSongDTO = {
        title: 'New Song',
        artists: ['Artist1'],
        duration: new Date(),
        lyrics: 'Lyrics of the song',
        releasedDate: new Date(),
        favorite: 'No',
      };
      const song = await controller.createSong(createSongDto);
      expect(song).toEqual({
        id: expect.any(String),
        ...createSongDto,
      });
    });
  });

  describe('updateSong', () => {
    it('should update an existing song', async () => {
      const updateSongDto: UpdateSongDto = {
        title: 'Updated Song',
        artists: ['Artist1'],
        duration: new Date(),
        lyrics: 'Updated lyrics of the song',
        releasedDate: new Date(),
        favorite: 'Yes',
      };
      const updatedSong = await controller.updateSong(1, updateSongDto);
      expect(updatedSong).toBeDefined();
      expect(updatedSong.affected).toBe(1);
    });
  });

  describe('deleteSong', () => {
    it('should delete a song with the given id', async () => {
      const result = await controller.deleteSong(1);
      expect(result).toBeDefined();
      expect(result.affected).toBe(1);
    });
  });
});
