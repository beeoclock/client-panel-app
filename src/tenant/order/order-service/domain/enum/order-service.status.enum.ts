export enum OrderServiceStatusEnum {
	requested = 'requested',       // Service has been requested but not yet accepted
	accepted = 'accepted',         // Service request has been accepted by the specialist
	ready = 'ready',               // Service is ready to be provided by the specialist
	inProgress = 'inProgress',     // Service is currently being provided by the specialist
	done = 'done',                 // Service has been successfully completed
	rejected = 'rejected',         // Service request has been rejected
	cancelled = 'cancelled',       // Service has been cancelled by the customer or the specialist
	deleted = 'deleted'            // Service has been removed or marked as deleted from the system
}
