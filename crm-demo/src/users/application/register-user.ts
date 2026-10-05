import { randomUUID } from 'node:crypto';
import { createUser, toRegisteredUser, type RegisteredUser } from '../domain/user.js';
import { DuplicateEmailError } from '../domain/errors.js';
import type { UserRepository } from '../persistence/user-repository.js';

export interface RegisterUserInput {
  email: string;
  password: string;
}

/**
 * Registers a new self-service user with role `'customer'`.
 *
 * @param repository - Where the new user is looked up and persisted.
 * @param input - The registrant's email and plaintext password.
 * @returns The created user's public shape (no password field).
 * @throws {DuplicateEmailError} If a user with the same email (case-insensitive) exists.
 * @throws {WeakPasswordError} If the password is under 8 characters.
 * @example
 * const user = await registerUser(repository, { email: 'a@b.com', password: 'longenough' });
 */
export async function registerUser(
  repository: UserRepository,
  input: RegisterUserInput
): Promise<RegisteredUser> {
  const normalizedEmail = input.email.toLowerCase();
  const existing = await repository.findByEmail(normalizedEmail);
  if (existing) {
    throw new DuplicateEmailError(`a user with email ${normalizedEmail} already exists`);
  }
  const user = createUser({ id: randomUUID(), email: input.email, password: input.password });
  await repository.save(user);
  return toRegisteredUser(user);
}
