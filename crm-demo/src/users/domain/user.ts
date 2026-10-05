import { randomBytes, scryptSync } from 'node:crypto';
import { WeakPasswordError } from './errors.js';

export type UserRole = 'admin' | 'customer';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;
}

export type RegisteredUser = Omit<User, 'passwordHash'>;

const MIN_PASSWORD_LENGTH = 8;
const SCRYPT_KEY_LENGTH = 64;

/**
 * Derives a salted, non-reversible hash for a plaintext password.
 *
 * @param password - The plaintext password to hash.
 * @returns A `salt:derivedKey` string, hex-encoded; never the plaintext.
 * @example
 * const stored = hashPassword('correct horse battery staple');
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex');
  return `${salt}:${derivedKey}`;
}

export interface CreateUserParams {
  id: string;
  email: string;
  password: string;
  role?: UserRole;
  createdAt?: Date;
}

/**
 * Creates a new domain User, hashing the password and lowercasing the email.
 *
 * @param params - Identity fields; `role` defaults to `'customer'`.
 * @returns The created User, including its password hash (never serialize
 * this outward — use {@link toRegisteredUser}).
 * @throws {WeakPasswordError} If `password` is under 8 characters.
 * @example
 * const user = createUser({ id: randomUUID(), email: 'a@b.com', password: 'longenough' });
 */
export function createUser(params: CreateUserParams): User {
  if (params.password.length < MIN_PASSWORD_LENGTH) {
    throw new WeakPasswordError(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return {
    id: params.id,
    email: params.email.toLowerCase(),
    passwordHash: hashPassword(params.password),
    role: params.role ?? 'customer',
    createdAt: params.createdAt ?? new Date(),
  };
}

/**
 * Strips the password hash from a User for safe return to a caller.
 *
 * @param user - The domain User to narrow.
 * @returns The user's public shape, with no password-related field.
 * @example
 * const safe = toRegisteredUser(user);
 */
export function toRegisteredUser(user: User): RegisteredUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
