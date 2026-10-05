import type { User } from '../domain/user.js';

/** Persistence boundary for Users (LAW-4.4 Repository pattern). */
export interface UserRepository {
  /** @returns The user with this email (case-insensitive), or `undefined`. */
  findByEmail(email: string): Promise<User | undefined>;
  /** Persists (creates or overwrites) a user. */
  save(user: User): Promise<void>;
}
