import { Exclude } from 'class-transformer';
import { Playlist } from 'src/modules/playlists/entities/playlists.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from 'src/common/types/interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: '2',
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Jane',
    description: 'first name',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Ahuchaogu',
    description: 'last name',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'jane@gmail.com',
    description: 'email',
  })
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    example: '56sdf6a4dfa6d6f65asd6',
    description: '2FA secret',
  })
  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @ApiProperty({
    example: 'false',
    description: 'enable2fa',
  })
  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @ApiProperty({
    example: 'artist',
    description: 'role',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    example: 'df33erasdf4eaw5f5as5df',
    description: 'apiKey',
  })
  @Column({ nullable: true })
  apiKey: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
}
