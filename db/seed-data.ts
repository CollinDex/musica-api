import { Artist } from 'src/modules/artists/entities/artists.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Playlist } from 'src/modules/playlists/entities/playlists.entity';

export const seedData = async (manager: EntityManager): Promise<void> => {
  await seedUser();
  await seedArtist();
  await seedPlaylists();

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
  }

  /* async function seedSongs() {
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

    const song = new Song();
    song.artists = [artist];
    song.title = faker.music.songName();
    song.releasedDate = faker.date.past({ years: 15 });
    song.duration = faker.system.;

    await manager.getRepository(User).save(user);
    await manager.getRepository(Artist).save(artist);
  } */
};

//TODO: CREATE SEEDING FUNCTION FOR SONGS AND REFACTOR SEEDER TO CREATE MULTIPLE ENTITIES
