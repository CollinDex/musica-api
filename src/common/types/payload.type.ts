import { UserRole } from './interface';

export interface PayloadType {
  email: string;
  userId: number;
  role: UserRole;
  artistId?: number;
}
