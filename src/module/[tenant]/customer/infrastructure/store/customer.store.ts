// It is a state for customers
import {signalStore, withMethods, withProps, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {ICustomer} from "@customer/index";
import {ActiveEnum} from "@utility/domain/enum";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import ECustomer from "../../domain/entity/e.customer";

const CustomerStore = signalStore(
	withProps(() => {
		return {
			ngxLogger: inject(NGXLogger),
		}
	}),
	withState({}),
	withDevtools('customer'),
	withMethods(({ngxLogger, ...store}) => {

		return {
			getItem: (id: string) => ECustomer.database.findOne({
				id,
			}),
			createItem: async (payload: ICustomer.DTO) => {
				ECustomer.database.insert(
					ECustomer.create(payload)
				);
				// await closeForm();
			},
			updateItem: async (payload: ICustomer.DTO) => {
				const item = ECustomer.create(payload);
				ECustomer.database.updateOne({
					id: payload._id,
				}, {
					$set: item
				});
				// await closeForm();
			},
			deleteItem: (id: string) => {
				ECustomer.database.removeOne({
					id,
				});
				// return closeDetails();
			},
			archiveItem: async (id: string) => {
				ECustomer.database.updateOne({
					id,
				}, {
					$set: {
						active: ActiveEnum.NO,
					}
				});
			},
			unarchiveItem: async (id: string) => {
				ECustomer.database.updateOne({
					id,
				}, {
					$set: {
						active: ActiveEnum.YES,
					}
				});
			},

		};
	}),
);

export default CustomerStore;
