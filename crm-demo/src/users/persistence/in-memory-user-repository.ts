import type { User } from '../domain/user.js';
import type { UserRepository } from './user-repository.js';

/**
 * In-process `UserRepository` implementation, keyed by lowercased email.
 * Reference-implementation persistence (see ADR-0003) — swap for a real
 * store by implementing `UserRepository` again; nothing above this layer
 * changes.
 */
export class InMemoryUserRepository implements UserRepository {
  private readonly usersByEmail = new Map<string, User>();

  /**
   * @param email - Looked up case-insensitively.
   * @returns The matching user, or `undefined`.
   * @example
   * await repository.findByEmail('JANE@EXAMPLE.COM');
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email.toLowerCase());
  }

  /**
   * Stores `user`, keyed by its lowercased email, overwriting any existing
   * entry with the same email.
   * @param user - The user to persist.
   */
  async save(user: User): Promise<void> {
    this.usersByEmail.set(user.email.toLowerCase(), user);
  }
}
