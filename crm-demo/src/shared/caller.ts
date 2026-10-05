export type CallerRole = 'admin' | 'customer';

export interface Caller {
  readonly id: string;
  readonly role: CallerRole;
}
