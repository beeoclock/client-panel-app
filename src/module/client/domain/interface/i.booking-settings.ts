export interface IBookingSettings {
  object: 'BookingSettings';
  approvalTime: number; // in seconds (Time after which the requested event will be canceled, if not approved)
  latestBooking: number; // in seconds (Minimum notice time)
  earliestBooking: number; // in seconds (When an event can be booked)
}
