import { InMemoryUserRepository } from './in-memory-user-repository.js';
import { createUser } from '../domain/user.js';

describe('InMemoryUserRepository', () => {
  it('should return undefined when finding by email with no match', async () => {
    const repository = new InMemoryUserRepository();

    await expect(repository.findByEmail('nobody@example.com')).resolves.toBeUndefined();
  });

  it('should find a previously-saved user by email case-insensitively', async () => {
    const repository = new InMemoryUserRepository();
    const user = createUser({ id: 'u1', email: 'jane@example.com', password: 'longenough' });
    await repository.save(user);

    await expect(repository.findByEmail('JANE@EXAMPLE.COM')).resolves.toEqual(user);
  });
});
