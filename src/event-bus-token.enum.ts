/**
 * Enum for event bus token
 * Use the enum to define the event bus tokens and NGXS cases when you need do several actions in different parts of the application, but you don't want to couple them.
 */
export const enum EventBusTokenEnum {
	SIDE_BAR_EVENT_REQUESTED_BADGE = 'SIDE_BAR_EVENT_REQUESTED_BADGE',
}
