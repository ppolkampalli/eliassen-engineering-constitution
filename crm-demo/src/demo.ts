/**
 * Runnable demo exercising every acceptance criterion in
 * `docs/requirements.md` end-to-end, in-process. Not a presentation layer
 * (ADR-0003) — a `memory-service/smoke.mjs`-style entry point for seeing the
 * use-cases actually work, prints only.
 */
import { randomUUID } from 'node:crypto';
import type { Caller } from './shared/caller.js';
import { registerUser } from './users/application/register-user.js';
import { InMemoryUserRepository } from './users/persistence/in-memory-user-repository.js';
import { createCustomerUseCase } from './customers/application/create-customer.js';
import { listCustomers } from './customers/application/list-customers.js';
import { updateCustomer } from './customers/application/update-customer.js';
import { InMemoryCustomerRepository } from './customers/persistence/in-memory-customer-repository.js';

async function main(): Promise<void> {
  const users = new InMemoryUserRepository();
  const customers = new InMemoryCustomerRepository();

  console.log('--- AC1: self-service registration ---');
  const registered = await registerUser(users, { email: 'visitor@example.com', password: 'longenough' });
  console.log('registered:', registered);

  // No admin-signup endpoint in this slice (ADR-0003) — an admin Caller is
  // what a real auth layer would hand to application code after login.
  const adminCaller: Caller = { id: randomUUID(), role: 'admin' };
  const customerCaller: Caller = { id: registered.id, role: 'customer' };

  console.log('\n--- AC2: role-gated actions ---');
  try {
    await createCustomerUseCase(customers, customerCaller, { name: 'Should Fail', email: 'fail@example.com' });
  } catch (error) {
    const err = error as Error;
    console.log('rejected as expected:', err.constructor.name, '-', err.message);
  }

  console.log('\n--- AC3: create customer records (admin) ---');
  const acme = await createCustomerUseCase(customers, adminCaller, {
    name: 'Acme Co',
    email: 'ops@acme.com',
    company: 'Acme',
  });
  const globex = await createCustomerUseCase(customers, adminCaller, {
    name: 'Globex Corp',
    email: 'ops@globex.com',
  });
  console.log('created:', `${acme.name} (${acme.status})`, '|', `${globex.name} (${globex.status})`);

  console.log('\n--- AC4: list / filter ---');
  const all = await listCustomers(customers, adminCaller);
  console.log(
    'all customers:',
    all.map((c) => c.name)
  );
  const leadsOnly = await listCustomers(customers, adminCaller, { status: 'lead' });
  console.log(
    'status=lead only:',
    leadsOnly.map((c) => c.name)
  );

  console.log('\n--- AC5: update ---');
  const updated = await updateCustomer(customers, adminCaller, acme.id, { status: 'active', phone: '555-0100' });
  console.log('updated:', `${updated.name} -> status=${updated.status}, phone=${updated.phone}`);
  const activeOnly = await listCustomers(customers, adminCaller, { status: 'active' });
  console.log(
    'status=active only:',
    activeOnly.map((c) => c.name)
  );

  console.log('\nAll acceptance criteria demonstrated successfully.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
