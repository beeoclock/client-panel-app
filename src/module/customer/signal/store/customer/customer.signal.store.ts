// import {addEntities, addEntity, withEntities} from '@ngrx/signals/entities';
// import {ICustomer, randomCustomer} from "@customer/domain";
// import {withCallState, withDevtools} from '@angular-architects/ngrx-toolkit';
// import {patchState, signalStore, withComputed, withHooks, withMethods, withState,} from '@ngrx/signals';
// import {DatabaseEntity} from "@src/database/interface/i.database.entity";
//
// export const CustomerStoreName = 'customer';
//
// export const CustomerStore = signalStore(
// 	{
// 		providedIn: 'root',
// 	},
// 	withState({}),
// 	withDevtools(CustomerStoreName),
// 	withEntities<DatabaseEntity<ICustomer>>(),
// 	withCallState(),
// 	withComputed(() => {
// 		return {};
// 	}),
// 	withMethods((store) => {
// 		return {
// 			addTodo(customer: ICustomer): void {
// 				patchState(store, addEntity(DatabaseEntity.create<ICustomer>(customer)));
// 			},
// 		};
// 	}),
// 	withHooks({
// 		onInit: (store) => {
// 			console.log('onInit', {store});
// 			patchState(store, addEntities([
// 				DatabaseEntity.create<ICustomer>(randomCustomer()),
// 				DatabaseEntity.create<ICustomer>(randomCustomer()),
// 				DatabaseEntity.create<ICustomer>(randomCustomer()),
// 				DatabaseEntity.create<ICustomer>(randomCustomer()),
// 				DatabaseEntity.create<ICustomer>(randomCustomer()),
// 			]));
// 			// store.sync(); // INFO: sync with remote example call
// 		},
// 	})
// );
