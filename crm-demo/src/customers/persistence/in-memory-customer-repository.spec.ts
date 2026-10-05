import { InMemoryCustomerRepository } from './in-memory-customer-repository.js';
import { createCustomer } from '../domain/customer.js';

describe('InMemoryCustomerRepository', () => {
  it('should return undefined when finding by id with no match', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(repository.findById('missing')).resolves.toBeUndefined();
  });

  it('should return all saved customers when listing with no filter', async () => {
    const repository = new InMemoryCustomerRepository();
    const a = createCustomer('c1', { name: 'A', email: 'a@example.com' });
    const b = createCustomer('c2', { name: 'B', email: 'b@example.com' });
    await repository.save(a);
    await repository.save(b);

    await expect(repository.list()).resolves.toEqual([a, b]);
  });

  it('should return only matching customers when listing with a status filter', async () => {
    const repository = new InMemoryCustomerRepository();
    const lead = createCustomer('c1', { name: 'A', email: 'a@example.com' });
    const active = { ...createCustomer('c2', { name: 'B', email: 'b@example.com' }), status: 'active' as const };
    await repository.save(lead);
    await repository.save(active);

    await expect(repository.list({ status: 'active' })).resolves.toEqual([active]);
  });
});
