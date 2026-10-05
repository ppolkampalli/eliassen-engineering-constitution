import { createCustomer } from './customer.js';
import { ValidationError } from './errors.js';

describe('createCustomer', () => {
  it('should default status to lead when creating a customer', () => {
    const customer = createCustomer('c1', { name: 'Acme Co', email: 'acme@example.com' });

    expect(customer.status).toBe('lead');
  });

  it('should throw ValidationError when name is missing', () => {
    expect(() => createCustomer('c1', { name: '', email: 'acme@example.com' })).toThrow(ValidationError);
  });

  it('should throw ValidationError when email is missing', () => {
    expect(() => createCustomer('c1', { name: 'Acme Co', email: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError when email is malformed', () => {
    expect(() => createCustomer('c1', { name: 'Acme Co', email: 'not-an-email' })).toThrow(ValidationError);
  });

  it('should carry optional phone and company when provided', () => {
    const customer = createCustomer('c1', {
      name: 'Acme Co',
      email: 'acme@example.com',
      phone: '555-0100',
      company: 'Acme',
    });

    expect(customer.phone).toBe('555-0100');
    expect(customer.company).toBe('Acme');
  });
});
