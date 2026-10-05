import { isValidEmail } from '../../shared/email.js';
import { ValidationError } from './errors.js';

export type CustomerStatus = 'lead' | 'active' | 'inactive';

export interface Customer {
  readonly id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

/**
 * Creates a new Customer record with `status` defaulted to `'lead'`.
 *
 * @param id - The record's identity, assigned by the caller (application layer).
 * @param input - Required `name`/`email`, plus optional `phone`/`company`.
 * @param createdAt - Creation timestamp; defaults to now.
 * @returns The created Customer.
 * @throws {ValidationError} If `name` or `email` is missing, or `email` is malformed.
 * @example
 * const customer = createCustomer(randomUUID(), { name: 'Acme', email: 'a@acme.com' });
 */
export function createCustomer(
  id: string,
  input: CreateCustomerInput,
  createdAt: Date = new Date()
): Customer {
  if (!input.name) {
    throw new ValidationError('name is required');
  }
  if (!input.email) {
    throw new ValidationError('email is required');
  }
  if (!isValidEmail(input.email)) {
    throw new ValidationError(`email is not a valid format: ${input.email}`);
  }
  return {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    status: 'lead',
    createdAt,
    updatedAt: createdAt,
  };
}
