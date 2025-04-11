export interface IProductDto {
	object: "ProductDto";
	_id: string;
	productCode: string;
	name: string;
	description: string;
	price: number;
	productType: string;
	inventoryCount: number;
	isActive: number;
	tags: string[];
	images: {
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
		};
		createdAt: string;
		updatedAt: string;
	}[];
	discountRate: number;
	seasonalDependency: string;
	createdAt: string;
	updatedAt: string;
}
