import { requireAdmin } from './authorize.js';
import type { Caller } from '../../shared/caller.js';
import type { Customer } from '../domain/customer.js';
import type { CustomerListFilter, CustomerRepository } from '../persistence/customer-repository.js';

/**
 * Lists customer records, optionally filtered by status. Admin-only.
 *
 * @param repository - Where customers are read from.
 * @param caller - The authenticated caller attempting the action.
 * @param filter - Optional status filter.
 * @returns Matching customers (all of them, if no filter is given).
 * @throws {NotAuthorizedError} If `caller.role` is not `'admin'`.
 * @example
 * const activeOnly = await listCustomers(repository, admin, { status: 'active' });
 */
export async function listCustomers(
  repository: CustomerRepository,
  caller: Caller,
  filter?: CustomerListFilter
): Promise<Customer[]> {
  requireAdmin(caller);
  return repository.list(filter);
}
