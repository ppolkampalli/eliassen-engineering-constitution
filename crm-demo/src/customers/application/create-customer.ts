import { randomUUID } from 'node:crypto';
import { requireAdmin } from './authorize.js';
import type { Caller } from '../../shared/caller.js';
import { createCustomer, type Customer, type CreateCustomerInput } from '../domain/customer.js';
import type { CustomerRepository } from '../persistence/customer-repository.js';

/**
 * Creates a customer record. Admin-only.
 *
 * @param repository - Where the new customer is persisted.
 * @param caller - The authenticated caller attempting the action.
 * @param input - The new customer's fields.
 * @returns The created Customer.
 * @throws {NotAuthorizedError} If `caller.role` is not `'admin'`.
 * @throws {ValidationError} If required fields are missing or email is malformed.
 * @example
 * const customer = await createCustomerUseCase(repository, admin, { name: 'Acme', email: 'a@acme.com' });
 */
export async function createCustomerUseCase(
  repository: CustomerRepository,
  caller: Caller,
  input: CreateCustomerInput
): Promise<Customer> {
  requireAdmin(caller);
  const customer = createCustomer(randomUUID(), input);
  await repository.save(customer);
  return customer;
}
