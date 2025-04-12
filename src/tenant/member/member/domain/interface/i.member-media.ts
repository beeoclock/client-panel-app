export interface RESPONSE_IMemberMedia {
	object: string;
	_id: string;
	url: string;
	mediaType: string;
	metadata: {
		object: string;
		original: boolean;
		format: string;
		height: number;
		width: number;
		size: number;
	},
	createdAt: string;
	updatedAt: string;
}

export interface REQUEST_IMemberMedia {
	file: Blob;
	_id?: string;
	width?: number;
	height?: number;
	mediaType?: string;
	object?: string;
}
