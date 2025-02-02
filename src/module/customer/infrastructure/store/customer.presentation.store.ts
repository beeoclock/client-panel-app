// It is a state for customers
import {signalStore, withMethods, withProps, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {ICustomer} from "@module/customer";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import ECustomer from "../../domain/entity/e.customer";

const CustomerPresentationStore = signalStore(
	withProps(() => {
		return {
			translateService: inject(TranslateService),
			whacAMaleProvider: inject(WhacAMoleProvider),
			ngxLogger: inject(NGXLogger),
		}
	}),
	withState({
		// TODO: use the state to know which customer details WhacAMole is opened
		// TODO: use the state to know which customer form WhacAMole is opened (Edit or Create)
	}),
	withDevtools('customerPresentation'),
	withMethods(({translateService, whacAMaleProvider, ngxLogger}) => {

		const openForm = async (payload?: {
			pushBoxInputs?: {
				id?: string;
				title?: string;
				showLoading?: boolean;
				callback?: {
					on?: {
						destroy?: {
							before?: () => void;
							after?: () => void;
						};
					};
				};
			};
			componentInputs?: {
				isEditMode?: boolean;
				item?: ICustomer.DTO;
			};
		}) => {

			const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");

			const {componentInputs, pushBoxInputs} = payload ?? {};

			await whacAMaleProvider.buildItAsync({
				title: translateService.instant('customer.form.title.create'),
				...pushBoxInputs,
				component: CustomerFormContainerComponent,
				componentInputs,
			});

		};

		const closeForm = async () => {
			const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");
			return whacAMaleProvider.destroyComponent(CustomerFormContainerComponent);
		};

		const closeDetails = async () => {
			const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");
			return whacAMaleProvider.destroyComponent(CustomerDetailsContainerComponent);
		};

		const updateOpenedDetails = async (item: ICustomer.Entity) => {
			const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");
			await whacAMaleProvider.updateWhacAMoleComponentAsync({
				component: CustomerDetailsContainerComponent,
				componentInputs: {item},
			}).catch((error) => {
				ngxLogger.error('CustomerState.updateOpenedDetails', error);
			});
		};

		const openDetailsById = async (id: string) => {

			const title = await translateService.instant('customer.details.title');

			const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

			const item = ECustomer.database.findOne({
				id,
			});

			console.log('openDetails', {item})

			await whacAMaleProvider.buildItAsync({
				title,
				componentInputs: {
					item
				},
				component: CustomerDetailsContainerComponent,
			});

		};

		const openFormToEditById = async (id: string) => {

			const title = await translateService.instant('customer.form.title.edit');

			await openForm({
				pushBoxInputs: {
					title,
					showLoading: true,
					id,
				},
			});

			const item = ECustomer.database.findOne({
				id,
			});

			await openForm({
				pushBoxInputs: {
					title,
					id,
				},
				componentInputs: {
					item,
					isEditMode: true,
				}
			});

		};

		return {
			closeDetails,
			closeForm,
			updateOpenedDetails,
			openDetailsById,
			openFormToEditById,
			openForm,
		};
	}),
);

export default CustomerPresentationStore;
