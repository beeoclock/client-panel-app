export const constant = {
	SECONDS: {
		ONE_DAY: 86400,
	},
};

export const endpoint = {
	config: {
		replace: false,
		loading: false,
		defaultErrorHandler: true,
	}
};

export const config = {
	modal: {
		prefix: 'beeoclock_modal_'
	},
	pagination: {
		maxLength: 5,
		pageSize: 20
	},
	startYear: 2022,
	syncManager: {
		pull: {
			pageSize: '500',
			page: '1',
			delay: 1_000
		}
	}
};
