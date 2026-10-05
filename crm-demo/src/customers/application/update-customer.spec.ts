import { updateCustomer } from './update-customer.js';
import { InMemoryCustomerRepository } from '../persistence/in-memory-customer-repository.js';
import { createCustomer } from '../domain/customer.js';
import { NotAuthorizedError } from '../../shared/errors.js';
import { NotFoundError } from '../domain/errors.js';
import type { Caller } from '../../shared/caller.js';

const admin: Caller = { id: 'u-admin', role: 'admin' };
const customer: Caller = { id: 'u-customer', role: 'customer' };

describe('updateCustomer', () => {
  it('should update status, phone, and company when called with an admin caller', async () => {
    const repository = new InMemoryCustomerRepository();
    const existing = createCustomer('c1', { name: 'Acme Co', email: 'acme@example.com' });
    await repository.save(existing);

    const result = await updateCustomer(repository, admin, 'c1', {
      status: 'active',
      phone: '555-0100',
      company: 'Acme',
    });

    expect(result.status).toBe('active');
    expect(result.phone).toBe('555-0100');
    expect(result.company).toBe('Acme');
  });

  it('should leave unspecified fields unchanged on a partial update', async () => {
    const repository = new InMemoryCustomerRepository();
    const existing = createCustomer('c1', {
      name: 'Acme Co',
      email: 'acme@example.com',
      phone: '555-0100',
      company: 'Acme',
    });
    await repository.save(existing);

    const result = await updateCustomer(repository, admin, 'c1', { status: 'active' });

    expect(result.phone).toBe('555-0100');
    expect(result.company).toBe('Acme');
  });

  it('should leave status unchanged when only phone and company are provided', async () => {
    const repository = new InMemoryCustomerRepository();
    const existing = {
      ...createCustomer('c1', { name: 'Acme Co', email: 'acme@example.com' }),
      status: 'active' as const,
    };
    await repository.save(existing);

    const result = await updateCustomer(repository, admin, 'c1', { phone: '555-0199' });

    expect(result.status).toBe('active');
    expect(result.phone).toBe('555-0199');
  });

  it('should leave name and email unchanged regardless of update payload', async () => {
    const repository = new InMemoryCustomerRepository();
    const existing = createCustomer('c1', { name: 'Acme Co', email: 'acme@example.com' });
    await repository.save(existing);

    const result = await updateCustomer(repository, admin, 'c1', { status: 'active' });

    expect(result.name).toBe('Acme Co');
    expect(result.email).toBe('acme@example.com');
  });

  it('should throw NotFoundError when updating an unknown customer id', async () => {
    const repository = new InMemoryCustomerRepository();

    await expect(updateCustomer(repository, admin, 'missing', { status: 'active' })).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw NotAuthorizedError and make no change when caller role is customer', async () => {
    const repository = new InMemoryCustomerRepository();
    const existing = createCustomer('c1', { name: 'Acme Co', email: 'acme@example.com' });
    await repository.save(existing);

    await expect(updateCustomer(repository, customer, 'c1', { status: 'active' })).rejects.toThrow(
      NotAuthorizedError
    );
    await expect(repository.findById('c1')).resolves.toEqual(existing);
  });
});
