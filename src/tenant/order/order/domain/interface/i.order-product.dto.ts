import {IProduct} from "@tenant/product/product/domain";
import {IBaseEntityRaw, IMeta} from "@core/shared/interface/i-base-entity.raw";
import {Types} from "@core/shared/types";
import {Tools} from "@core/shared/tools";

export interface IOrderProductDto extends IBaseEntityRaw<'OrderProductDto'> {
	orderId: string & Types.ObjectId;
	meta: IMeta;

	quantity: number;
	orderServiceId: string;
	productSnapshot: IProduct.DTO;

	// TODO: Implement BOC-
	// specialistReadyAt: string | null; // New field added, the field talks about the time the specialist is ready to start the service, specialist can set the date only if start in future
}

export const isOrderProductDto = Tools.createIs<IOrderProductDto>();
export const validOrderProductDto = Tools.createValidate<IOrderProductDto>();
export const randomOrderProductDto = Tools.createRandom<IOrderProductDto>();
