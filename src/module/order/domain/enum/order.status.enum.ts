export enum OrderStatusEnum {
	draft = 'draft',
	requested = 'requested',
	confirmed = 'confirmed',
	inProgress = 'inProgress',
	done = 'done',
	cancelled = 'cancelled', // By customer
	rejected = 'rejected' // By member
}
