export enum OrderStatusEnum {
  draft = 'draft',
  unconfirmed = 'unconfirmed',
  confirmed = 'confirmed',
  pending = 'pending',
  done = 'done',
  cancelled = 'cancelled', // By customer
  rejected = 'rejected' // By member
}
