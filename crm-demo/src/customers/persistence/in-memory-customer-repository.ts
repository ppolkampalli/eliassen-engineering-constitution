import type { Customer } from '../domain/customer.js';
import type { CustomerListFilter, CustomerRepository } from './customer-repository.js';

/**
 * In-process `CustomerRepository` implementation, keyed by id.
 * Reference-implementation persistence (see ADR-0003) — swap for a real
 * store by implementing `CustomerRepository` again; nothing above this
 * layer changes.
 */
export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly customersById = new Map<string, Customer>();

  /**
   * Stores `customer`, keyed by id, overwriting any existing entry with the
   * same id.
   * @param customer - The customer to persist.
   */
  async save(customer: Customer): Promise<void> {
    this.customersById.set(customer.id, customer);
  }

  /**
   * @param id - The customer's id.
   * @returns The matching customer, or `undefined`.
   */
  async findById(id: string): Promise<Customer | undefined> {
    return this.customersById.get(id);
  }

  /**
   * @param filter - Optional status filter.
   * @returns All customers, or only those matching `filter.status` if given.
   * @example
   * await repository.list({ status: 'active' });
   */
  async list(filter?: CustomerListFilter): Promise<Customer[]> {
    const all = Array.from(this.customersById.values());
    if (!filter?.status) {
      return all;
    }
    return all.filter((customer) => customer.status === filter.status);
  }
}
