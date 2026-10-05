import { registerUser } from './register-user.js';
import { InMemoryUserRepository } from '../persistence/in-memory-user-repository.js';
import { DuplicateEmailError } from '../domain/errors.js';
import { WeakPasswordError } from '../domain/errors.js';

describe('registerUser', () => {
  it('should create a user with role customer when registering with valid unique email/password', async () => {
    const repository = new InMemoryUserRepository();

    const result = await registerUser(repository, { email: 'jane@example.com', password: 'longenough' });

    expect(result.role).toBe('customer');
    expect(result.email).toBe('jane@example.com');
  });

  it('should throw DuplicateEmailError when registering with an email already in use', async () => {
    const repository = new InMemoryUserRepository();
    await registerUser(repository, { email: 'jane@example.com', password: 'longenough' });

    await expect(
      registerUser(repository, { email: 'jane@example.com', password: 'anotherpass' })
    ).rejects.toThrow(DuplicateEmailError);
  });

  it('should throw DuplicateEmailError when registering with an email differing only in case', async () => {
    const repository = new InMemoryUserRepository();
    await registerUser(repository, { email: 'jane@example.com', password: 'longenough' });

    await expect(
      registerUser(repository, { email: 'JANE@EXAMPLE.COM', password: 'anotherpass' })
    ).rejects.toThrow(DuplicateEmailError);
  });

  it('should throw WeakPasswordError and create no user when password is under 8 characters', async () => {
    const repository = new InMemoryUserRepository();

    await expect(registerUser(repository, { email: 'jane@example.com', password: 'short1' })).rejects.toThrow(
      WeakPasswordError
    );
    await expect(repository.findByEmail('jane@example.com')).resolves.toBeUndefined();
  });

  it('should return a user shape with no password or passwordHash field', async () => {
    const repository = new InMemoryUserRepository();

    const result = await registerUser(repository, { email: 'jane@example.com', password: 'longenough' });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });
});
