import { createUser, hashPassword } from './user.js';
import { WeakPasswordError } from './errors.js';

describe('createUser', () => {
  it('should normalize email to lowercase when creating a user', () => {
    const user = createUser({ id: 'u1', email: 'Jane@Example.COM', password: 'longenough' });

    expect(user.email).toBe('jane@example.com');
  });

  it('should throw WeakPasswordError when password is under 8 characters', () => {
    expect(() => createUser({ id: 'u1', email: 'jane@example.com', password: 'short1' })).toThrow(
      WeakPasswordError
    );
  });

  it('should hash the password when creating a user', () => {
    const user = createUser({ id: 'u1', email: 'jane@example.com', password: 'longenough' });

    expect(user.passwordHash).not.toBe('longenough');
    expect(user.passwordHash).toContain(':');
  });

  it('should default role to customer when no role is given', () => {
    const user = createUser({ id: 'u1', email: 'jane@example.com', password: 'longenough' });

    expect(user.role).toBe('customer');
  });

  it('should use the given role when one is provided', () => {
    const user = createUser({ id: 'u1', email: 'jane@example.com', password: 'longenough', role: 'admin' });

    expect(user.role).toBe('admin');
  });
});

describe('hashPassword', () => {
  it('should produce different hashes for the same password across calls (salted)', () => {
    expect(hashPassword('longenough')).not.toBe(hashPassword('longenough'));
  });
});
