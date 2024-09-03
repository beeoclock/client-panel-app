import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {CustomerForm} from "@customer/presentation/form";
import {
	IonAvatar,
	IonCheckbox,
	IonContent,
	IonHeader,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonItem,
	IonLabel,
	IonList,
	IonSearchbar,
	IonSegment,
	IonSegmentButton,
	IonSpinner,
	IonToolbar
} from "@ionic/angular/standalone";
import {AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ReactiveFormsModule} from "@angular/forms";
import {FormAttendantComponent} from "@event/presentation/component/form/attendees/attendant/form.attendant.component";
import {
	NamesFormAttendantComponent
} from "@event/presentation/component/form/attendees/attendant/names.form.attendant.component";
import {TranslateModule} from "@ngx-translate/core";
import {ICustomer} from "@customer/domain";
import {Store} from "@ngxs/store";
import {Reactive} from "@utility/cdk/reactive";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import ObjectID from "bson-objectid";
import {EventListCustomerAdapter} from "@customer/adapter/external/module/event.list.customer.adapter";

@Component({
	selector: 'app-customer-list-ionic-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonList,
		IonSearchbar,
		IonItem,
		IonLabel,
		NgForOf,
		IonAvatar,
		IonCheckbox,
		IonSegment,
		IonSegmentButton,
		IonContent,
		IonHeader,
		IonToolbar,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		ReactiveFormsModule,
		NgSwitch,
		NgSwitchCase,
		FormAttendantComponent,
		NamesFormAttendantComponent,
		TranslateModule,
		AsyncPipe,
		NgIf,
		PrimaryButtonDirective,
		NgTemplateOutlet,
		IonSpinner
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
						<ion-searchbar
							[debounce]="1000"
							(ionInput)="handleInput($event)"
							[placeholder]="'keyword.capitalize.search' | translate">
						</ion-searchbar>
						<ion-list>
							@for (customer of eventListCustomerAdapter.tableState.items; track customer._id) {
								<ion-item (click)="select(customer)" lines="full" [button]="true" [detailIcon]="false">
									<ion-avatar aria-hidden="true" slot="start">
										<div
											class="min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px] rounded-full bg-beeColor-400 flex justify-center items-center uppercase">
											{{ customer.firstName?.[0] }}{{ customer.lastName?.[0] }}
										</div>
									</ion-avatar>
									<ion-label>
										{{ customer.firstName }} {{ customer.lastName }}
									</ion-label>
									<ion-checkbox slot="end" [value]="0" [checked]="isChecked(customer)"/>
								</ion-item>
							}
							@if (eventListCustomerAdapter.loading$.isFalse) {

								<ion-item lines="full" [button]="true"
										  [detailIcon]="false" (click)="nextPage()">
									<ion-label>
										{{ 'keyword.capitalize.downloadMore' | translate }}
									</ion-label>
								</ion-item>

							}

						</ion-list>
						@if (eventListCustomerAdapter.loading$.isTrue) {
							<div class="p-3">
								<ion-spinner name="dots"></ion-spinner>
							</div>
						}
					</div>

				}
			}

		</ion-content>
		<div class="px-3 pb-3 flex justify-between items-center sticky bottom-0">
			<button primary (click)="done()">
				{{ 'keyword.capitalize.done' | translate }}
			</button>
		</div>
	`
})
export class CustomerListIonicComponent extends Reactive implements OnInit {

	@Input({ required: true })
	public customerForm!: CustomerForm;
	public readonly doDone = output<boolean>();

	protected readonly store = inject(Store);
	protected readonly localCustomerForm = CustomerForm.create();

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly eventListCustomerAdapter = inject(EventListCustomerAdapter);

	protected selectedCustomer: ICustomer | undefined;

	public ngOnInit() {
		if (!this.eventListCustomerAdapter.tableState.items.length) {
			this.eventListCustomerAdapter.resetTableState().getPageAsync().then(() => {
				this.changeDetectorRef.detectChanges();
			});
		}
		this.initLocalFormValue();
	}

	public async handleInput(event: any) {
		const query = event.target.value.toLowerCase();
		await this.eventListCustomerAdapter.filterByPhrase(query).getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	public select(customer: ICustomer) {
		this.selectedCustomer = customer;
		this.changeDetectorRef.detectChanges();
	}

	public isChecked(customer: ICustomer) {
		if (!this.selectedCustomer) return false;
		return this.selectedCustomer._id === customer._id;
	}

	private initFormValue() {
		if (this.selectedCustomer) {
			this.customerForm.patchValue(this.selectedCustomer);
			return;
		}
		this.customerForm.patchValue(this.localCustomerForm.value);
	}

	private initLocalFormValue() {
		this.localCustomerForm.patchValue(this.customerForm.value);
		if (this.localCustomerForm.value.customerType === CustomerTypeEnum.regular) {
			this.selectedCustomer = this.localCustomerForm.getRawValue();
		}
	}

	protected done() {

		if (this.localCustomerForm.invalid && !this.selectedCustomer) return;

		if (JSON.stringify(this.localCustomerForm.value) === JSON.stringify(this.customerForm.value)) {
			this.doDone.emit(false);
			this.changeDetectorRef.detectChanges();
			return;
		}

		this.initFormValue();
		this.doDone.emit(true);
		this.changeDetectorRef.detectChanges();

	}

	protected changeCustomerType() {
		this.selectedCustomer = undefined;
		this.clearForm();
		this.changeDetectorRef.detectChanges();
	}

	protected clearForm() {
		this.customerForm.patchValue({
			_id: ObjectID().toHexString(),
			firstName: null,
			lastName: null,
			email: null,
			phone: null,
		})
	}

	protected async nextPage() {
		await this.eventListCustomerAdapter.getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;

}
