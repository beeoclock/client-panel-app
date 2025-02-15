export enum OrderStatusEnum {
	requested = 'requested',
	draft = 'draft',
	inProgress = 'inProgress',
	done = 'done',
	rejected = 'rejected', // By member
	confirmed = 'confirmed',
	cancelled = 'cancelled', // By customer
}
