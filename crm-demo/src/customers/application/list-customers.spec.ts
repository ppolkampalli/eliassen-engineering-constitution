import { listCustomers } from './list-customers.js';
import { InMemoryCustomerRepository } from '../persistence/in-memory-customer-repository.js';
import { createCustomer } from '../domain/customer.js';
import { NotAuthorizedError } from '../../shared/errors.js';
import type { Caller } from '../../shared/caller.js';

const admin: Caller = { id: 'u-admin', role: 'admin' };
const customer: Caller = { id: 'u-customer', role: 'customer' };

describe('listCustomers', () => {
  it('should return an empty list when no customers exist', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(listCustomers(repository, admin)).resolves.toEqual([]);
  });

  it('should return all customers when called with an admin caller and no filter', async () => {
    const repository = new InMemoryCustomerRepository();
    const a = createCustomer('c1', { name: 'A', email: 'a@example.com' });
    const b = createCustomer('c2', { name: 'B', email: 'b@example.com' });
    await repository.save(a);
    await repository.save(b);

    await expect(listCustomers(repository, admin)).resolves.toEqual([a, b]);
  });

  it('should return only matching customers when filtered by status', async () => {
    const repository = new InMemoryCustomerRepository();
    const lead = createCustomer('c1', { name: 'A', email: 'a@example.com' });
    const active = { ...createCustomer('c2', { name: 'B', email: 'b@example.com' }), status: 'active' as const };
    await repository.save(lead);
    await repository.save(active);

    await expect(listCustomers(repository, admin, { status: 'active' })).resolves.toEqual([active]);
  });

  it('should throw NotAuthorizedError when caller role is customer', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(listCustomers(repository, customer)).rejects.toThrow(NotAuthorizedError);
  });
});
