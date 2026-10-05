import { requireAdmin } from './authorize.js';
import type { Caller } from '../../shared/caller.js';
import type { Customer, CustomerStatus } from '../domain/customer.js';
import { NotFoundError } from '../domain/errors.js';
import type { CustomerRepository } from '../persistence/customer-repository.js';

export interface UpdateCustomerInput {
  status?: CustomerStatus;
  phone?: string;
  company?: string;
}

/**
 * Updates `status`/`phone`/`company` on an existing customer. Admin-only.
 * `name` and `email` are immutable through this operation (not in `input`'s type).
 *
 * @param repository - Where the customer is looked up and persisted.
 * @param caller - The authenticated caller attempting the action.
 * @param id - The customer's id.
 * @param input - Partial update; omitted fields are left unchanged.
 * @returns The updated Customer.
 * @throws {NotAuthorizedError} If `caller.role` is not `'admin'`.
 * @throws {NotFoundError} If no customer exists with `id`.
 * @example
 * const updated = await updateCustomer(repository, admin, 'c1', { status: 'active' });
 */
export async function updateCustomer(
  repository: CustomerRepository,
  caller: Caller,
  id: string,
  input: UpdateCustomerInput
): Promise<Customer> {
  requireAdmin(caller);
  const existing = await repository.findById(id);
  if (!existing) {
    throw new NotFoundError(`customer ${id} not found`);
  }
  const updated: Customer = {
    ...existing,
    status: input.status ?? existing.status,
    phone: input.phone ?? existing.phone,
    company: input.company ?? existing.company,
    updatedAt: new Date(),
  };
  await repository.save(updated);
  return updated;
}
