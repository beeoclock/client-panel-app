import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnDestroy,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {
	IonAvatar,
	IonCheckbox,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonSearchbar,
	IonSegment,
	IonSegmentButton,
	IonSpinner,
	IonToolbar
} from "@ionic/angular/standalone";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {ReactiveFormsModule} from "@angular/forms";
import {
	FormAttendantComponent
} from "@tenant/event/presentation/ui/component/form/attendees/attendant/form.attendant.component";
import {
	NamesFormAttendantComponent
} from "@tenant/event/presentation/ui/component/form/attendees/attendant/names.form.attendant.component";
import {TranslateModule} from "@ngx-translate/core";
import {ICustomer} from "@tenant/customer/domain";
import {Store} from "@ngxs/store";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import ObjectID from "bson-objectid";
import {DefaultButtonDirective} from "@shared/presentation/directives/button/default.button.directive";
import {NGXLogger} from "ngx-logger";
import {GlobalEventListCustomerRepository} from "@src/token";

@Component({
	selector: 'app-customer-list-ionic-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonHeader,
		IonToolbar,
		IonSegment,
		IonSegmentButton,
		IonLabel,
		TranslateModule,
		ReactiveFormsModule,
		IonContent,
		FormAttendantComponent,
		NamesFormAttendantComponent,
		IonSearchbar,
		IonList,
		IonItem,
		IonAvatar,
		IonCheckbox,
		IonSpinner,
		PrimaryButtonDirective,
		DefaultButtonDirective
	],
	template: `

		<ion-header>
			<ion-toolbar>
				<ion-segment (ionChange)="changeCustomerType()"
							 [formControl]="localCustomerForm.controls.customerType">
					<ion-segment-button [value]="customerTypeEnum.regular">
						<ion-label>
							{{ 'customer.enum.type.regular' | translate }}
						</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.new">
						<ion-label>
							{{ 'customer.enum.type.new' | translate }}
						</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.unregistered">
						<ion-label>
							{{ 'customer.enum.type.unregistered' | translate }}
						</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.anonymous">
						<ion-label>
							{{ 'customer.enum.type.anonymous' | translate }}
						</ion-label>
					</ion-segment-button>
				</ion-segment>
			</ion-toolbar>
		</ion-header>
		<ion-content scroll-y="false" class="ion-padding">
			@switch (localCustomerForm.value.customerType) {

				@case (customerTypeEnum.anonymous) {

					<div class="p-3 max-w-xs min-w-[20rem]">
						<div class="text-2xl font-bold">
							{{ 'keyword.capitalize.anonymous' | translate }}
						</div>
						<div>
							{{ 'order.form.service.customer.hist.anonymous' | translate }}
						</div>
					</div>
				}
				@case (customerTypeEnum.new) {
					<app-event-form-attendant-component
						class="p-3 block min-w-[20rem]"
						[form]="localCustomerForm"/>
				}
				@case (customerTypeEnum.unregistered) {
					<app-event-names-form-attendant-component
						class="p-3 min-w-[20rem]"
						[form]="localCustomerForm"/>
				}
				@case (customerTypeEnum.regular) {

					<div class="min-w-[20rem] max-h-full">
						<ion-searchbar [id]="id() + 'ion-searchbar'"
							[debounce]="1000"
							(ionInput)="handleInput($event)"
							[placeholder]="'keyword.capitalize.search' | translate" />
						<ion-list
							class="pb-3"
							[id]="id() + 'ion-list'">
							@for (customer of eventListCustomerAdapter.tableState.items; track customer._id) {
								<ion-item
									(click)="select(customer)"
									lines="full"
									[id]="id() + 'ion-item-' + customer._id">
									<ion-avatar aria-hidden="true" slot="start">
										<div
											class="min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px] rounded-full bg-beeColor-400 flex justify-center items-center uppercase">
											{{ customer.firstName?.[0] }}{{ customer.lastName?.[0] }}
										</div>
									</ion-avatar>
									<ion-label>
										<div class="flex flex-col gap-1">
											<div class="font-bold text-sm">
												{{ customer.firstName }} {{ customer.lastName }}
											</div>
											<div class="text-sm">
												{{ customer.phone ?? customer.email }}
											</div>
										</div>
									</ion-label>
									<ion-checkbox slot="end" [value]="0" [checked]="isChecked(customer)"/>
								</ion-item>
							}
							@if (eventListCustomerAdapter.loading$.isFalse) {

								<ion-item [id]="id() + '-ion-item-download-more'" lines="full" [button]="true" (click)="nextPage()">
									<ion-label [id]="id() + '-ion-item-download-more-ion-label'">
										{{ 'keyword.capitalize.downloadMore' | translate }}
									</ion-label>
								</ion-item>

							}

						</ion-list>
						@if (eventListCustomerAdapter.loading$.isTrue) {
							<div class="p-3">
								<ion-spinner [id]="id() + '-ion-spinner'" name="dots" />
							</div>
						}
					</div>

				}
			}

		</ion-content>
		<div class="px-3 pb-3 gap-3 flex justify-between items-center sticky bottom-0">
			<button default (click)="cancel()">
				{{ 'keyword.capitalize.cancel' | translate }}
			</button>
			<button primary (click)="done()">
				{{ 'keyword.capitalize.done' | translate }}
			</button>
		</div>
	`
})
export class CustomerListIonicComponent implements OnInit, OnDestroy {

	public readonly customerForm = input.required<CustomerForm>();

	public readonly id = input.required<string>();

	public readonly doDone = output<boolean>();

	protected readonly store = inject(Store);
	protected readonly localCustomerForm = CustomerForm.create();

	public readonly ngxLogger = inject(NGXLogger);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly eventListCustomerAdapter = inject(GlobalEventListCustomerRepository);

	protected selectedCustomer: ICustomer.DTO | undefined;

	public ngOnInit() {
		if (!this.eventListCustomerAdapter.tableState.items.length) {
			this.eventListCustomerAdapter.resetTableState().getPageAsync().then(() => {
				this.changeDetectorRef.detectChanges();
			});
		}
		this.initLocalFormValue();
	}

	public ngOnDestroy() {
		this.eventListCustomerAdapter.resetTableState();
	}

	public async handleInput(event: any) {
		const query = event.target.value.toLowerCase();
		await this.eventListCustomerAdapter.filterByPhrase(query).getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	public select(customer: ICustomer.DTO) {
		this.selectedCustomer = customer;
		this.localCustomerForm.patchValue(customer);
		this.changeDetectorRef.detectChanges();
	}

	public isChecked(customer: ICustomer.DTO) {
		if (!this.selectedCustomer) return false;
		return this.selectedCustomer._id === customer._id;
	}

	private initFormValue() {
		this.customerForm().patchValue(this.localCustomerForm.value);
	}

	private initLocalFormValue() {
		this.localCustomerForm.patchValue(this.customerForm().value);
		this.detectIfCustomerSelect();
	}

	protected done() {

		this.localCustomerForm.markAllAsTouched();

		if (this.localCustomerForm.invalid) {
			this.ngxLogger.error('Form is invalid', this.localCustomerForm.errors);
			return;
		}

		this.initFormValue();
		this.doDone.emit(true);
		this.changeDetectorRef.detectChanges();

	}

	protected cancel() {
		this.doDone.emit(false);
		this.changeDetectorRef.detectChanges();
	}

	protected changeCustomerType() {
		this.detectIfCustomerSelect();
		this.clearLocalForm();
		this.changeDetectorRef.detectChanges();
	}

	protected clearLocalForm() {
		this.localCustomerForm.patchValue({
			_id: ObjectID().toHexString(),
			firstName: null,
			lastName: null,
			email: null,
			phone: null,
		});
		this.localCustomerForm.markAsUntouched();
	}

	protected async nextPage() {
		await this.eventListCustomerAdapter.getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;

	private detectIfCustomerSelect() {
		const customerForm = this.customerForm();
		if (customerForm.value.customerType === CustomerTypeEnum.regular) {
			this.selectedCustomer = customerForm.getRawValue();
		}
	}

}
