import { createCustomerUseCase } from './create-customer.js';
import { InMemoryCustomerRepository } from '../persistence/in-memory-customer-repository.js';
import { NotAuthorizedError } from '../../shared/errors.js';
import { ValidationError } from '../domain/errors.js';
import type { Caller } from '../../shared/caller.js';

const admin: Caller = { id: 'u-admin', role: 'admin' };
const customer: Caller = { id: 'u-customer', role: 'customer' };

describe('createCustomerUseCase', () => {
  it('should create a customer with a valid admin caller and valid input', async () => {
    const repository = new InMemoryCustomerRepository();

    const result = await createCustomerUseCase(repository, admin, {
      name: 'Acme Co',
      email: 'acme@example.com',
    });

    expect(result.status).toBe('lead');
    await expect(repository.findById(result.id)).resolves.toEqual(result);
  });

  it('should throw NotAuthorizedError and create nothing when caller role is customer', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(
      createCustomerUseCase(repository, customer, { name: 'Acme Co', email: 'acme@example.com' })
    ).rejects.toThrow(NotAuthorizedError);
    await expect(repository.list()).resolves.toEqual([]);
  });

  it('should throw ValidationError and create nothing when required fields are missing', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(createCustomerUseCase(repository, admin, { name: '', email: '' })).rejects.toThrow(
      ValidationError
    );
    await expect(repository.list()).resolves.toEqual([]);
  });
});
