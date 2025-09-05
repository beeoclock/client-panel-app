export enum PaymentStatusEnum {
  registered = 'registered', // Registered and user tried to pay but payment is not yet processed
  pending = 'pending',
  succeeded = 'succeeded',
  failed = 'failed',
  expired = 'expired',
}
