import type { Customer, CustomerStatus } from '../domain/customer.js';

export interface CustomerListFilter {
  status?: CustomerStatus;
}

/** Persistence boundary for Customers (LAW-4.4 Repository pattern). */
export interface CustomerRepository {
  /** Persists (creates or overwrites) a customer. */
  save(customer: Customer): Promise<void>;
  /** @returns The customer with this id, or `undefined`. */
  findById(id: string): Promise<Customer | undefined>;
  /** @returns All customers, or only those matching `filter.status` if given. */
  list(filter?: CustomerListFilter): Promise<Customer[]>;
}
