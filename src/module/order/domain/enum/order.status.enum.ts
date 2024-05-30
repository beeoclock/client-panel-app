export enum OrderStatusEnum {
  draft = 'draft',
  requested = 'requested',
  confirmed = 'confirmed',
  pending = 'pending',
  done = 'done',
  cancelled = 'cancelled', // By customer
  rejected = 'rejected' // By member
}
