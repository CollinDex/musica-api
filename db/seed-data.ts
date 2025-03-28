import { Artist } from 'src/modules/artists/entities/artists.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Playlist } from 'src/modules/playlists/entities/playlists.entity';
import { Song } from 'src/modules/songs/entities/songs.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  for (let index = 0; index < 3; index++) {
    await seedUser();
    await seedArtist();
    await seedPlaylists();
    await seedSongs(manager);
  }

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('test123', salt);

    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();

    await manager.getRepository(User).save(user);
    console.log('✅ Users seeded successfully!');
  }

  async function seedArtist() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('test123', salt);

    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();

    const artist = new Artist();
    artist.user = user;

    await manager.getRepository(User).save(user);
    await manager.getRepository(Artist).save(artist);
    console.log('✅ Artist seeded successfully!');
  }

  async function seedPlaylists() {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash('test123', salt);

    const user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = encryptedPassword;
    user.apiKey = uuid4();

    const playlist = new Playlist();
    playlist.user = user;
    playlist.name = faker.music.songName();

    await manager.getRepository(User).save(user);
    await manager.getRepository(Playlist).save(playlist);
    console.log('✅ Playlist seeded successfully!');
  }

  async function seedSongs(manager: EntityManager) {
    const songRepository = manager.getRepository(Song);
    const artistRepository = manager.getRepository(Artist);
    const playlistRepository = manager.getRepository(Playlist);

    // Fetch all artists and playlists
    const artists = await artistRepository.find();
    const playlists = await playlistRepository.find();

    if (artists.length === 0 || playlists.length === 0) {
      console.warn('⚠️ No artists or playlists found. Please seed them first.');
      return;
    }

    const songs: Song[] = [];

    for (let i = 0; i < 5; i++) {
      const song = new Song();
      song.title = faker.music.songName();
      song.releasedDate = faker.date.past({ years: 15 });

      // ✅ Correct way to store duration as a Date (3-5 minutes)
      const baseDate = new Date(0); // Reference Date: 1970-01-01
      baseDate.setMinutes(faker.number.int({ min: 2, max: 5 }));
      baseDate.setSeconds(faker.number.int({ min: 0, max: 59 }));

      song.duration = baseDate; // ✅ Assign as Date

      song.favorite = faker.datatype.boolean() ? 'yes' : 'no';
      song.lyrics = faker.lorem.paragraphs(2);

      // Assign random artists (1-3 per song)
      song.artists = faker.helpers.arrayElements(
        artists,
        faker.number.int({ min: 1, max: 3 }),
      );
      console.log(song.artists);

      // Assign a random playlist
      song.playlist = faker.helpers.arrayElement(playlists);

      songs.push(song);
    }

    await songRepository.save(songs);
    console.log('✅ Songs seeded successfully!');
  }
};

//TODO: CREATE SEEDING FUNCTION FOR SONGS AND REFACTOR SEEDER TO CREATE MULTIPLE ENTITIES
