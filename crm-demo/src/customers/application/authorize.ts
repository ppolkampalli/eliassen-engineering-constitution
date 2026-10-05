import type { Caller } from '../../shared/caller.js';
import { NotAuthorizedError } from '../../shared/errors.js';

/**
 * Guards an admin-only use-case.
 *
 * @param caller - The authenticated caller attempting the action.
 * @throws {NotAuthorizedError} If `caller.role` is not `'admin'`.
 * @example
 * requireAdmin(caller); // throws if caller.role !== 'admin'
 */
export function requireAdmin(caller: Caller): void {
  if (caller.role !== 'admin') {
    throw new NotAuthorizedError('admin role required');
  }
}
