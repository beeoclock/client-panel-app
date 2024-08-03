import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
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
		<ng-container *ngIf="customerForm() as customerFormGroup">

			<ion-header>
				<ion-toolbar>

					<ion-segment (ionChange)="changeCustomerType()"
								 [formControl]="customerFormGroup.controls.customerType">
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
			<ion-content scroll-y="false" class="ion-padding" [ngSwitch]="customerFormGroup.value.customerType">
				<ng-container *ngSwitchCase="customerTypeEnum.anonymous">
					<div class="p-4 max-w-xs min-w-[20rem]">
						<div class="text-2xl font-bold">
							{{ 'keyword.capitalize.anonymous' | translate }}
						</div>
						<div>
							{{ 'order.form.service.customer.hist.anonymous' | translate }}
						</div>
					</div>
				</ng-container>
				<ng-container *ngSwitchCase="customerTypeEnum.new">
					<app-event-form-attendant-component class="p-4 block max-w-xs min-w-[20rem]"
														[form]="customerFormGroup"/>
					<ng-container [ngTemplateOutlet]="FooterFormTemplate"/>
				</ng-container>
				<ng-container *ngSwitchCase="customerTypeEnum.unregistered">
					<app-event-names-form-attendant-component class="p-4 max-w-xs min-w-[20rem]"
															  [form]="customerFormGroup"/>
					<ng-container [ngTemplateOutlet]="FooterFormTemplate"/>
				</ng-container>
				<ng-container *ngSwitchCase="customerTypeEnum.regular">
					<div class="max-w-xs min-w-[20rem] max-h-full">
						<ion-searchbar [debounce]="1000" (ionInput)="handleInput($event)"
									   [placeholder]="'keyword.capitalize.search' | translate"></ion-searchbar>
						<ion-list>
							<ion-item (click)="select(customer)" lines="full" [button]="true" [detailIcon]="false"
									  *ngFor="let customer of eventListCustomerAdapter.tableState.items; trackBy: trackById">
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
							<ion-item lines="full" *ngIf="eventListCustomerAdapter.loading$.isFalse" [button]="true"
									  [detailIcon]="false" (click)="nextPage()">
								<ion-label>
									{{ 'keyword.capitalize.downloadMore' | translate }}
								</ion-label>
							</ion-item>
						</ion-list>
						<div class="p-4" *ngIf="eventListCustomerAdapter.loading$.isTrue">
							<ion-spinner name="dots"></ion-spinner>
						</div>
					</div>
				</ng-container>

			</ion-content>

			<ng-template #FooterFormTemplate>
				<div class="px-4 pb-4 flex justify-between items-center">
					<button primary (click)="doDone.emit()">
						{{ 'keyword.capitalize.done' | translate }}
					</button>
				</div>
			</ng-template>
		</ng-container>
	`
})
export class CustomerListIonicComponent extends Reactive implements OnInit {

	public customerForm = input.required<CustomerForm>();
	public readonly doDone = output();

	protected readonly store = inject(Store);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly eventListCustomerAdapter = inject(EventListCustomerAdapter);

	public trackById(index: number, item: ICustomer) {
		return item._id;
	}

	public ngOnInit() {
		this.eventListCustomerAdapter.resetTableState().getPageAsync().then();
	}

	async handleInput(event: any) {
		const query = event.target.value.toLowerCase();
		await this.eventListCustomerAdapter.filterByPhrase(query).getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	select(customer: ICustomer) {
		this.customerForm().patchValue(customer);
		console.log(this.customerForm().value);
		this.doDone.emit();
	}

	isChecked(customer: ICustomer) {
		return this.customerForm().value._id === customer._id;
	}

	protected changeCustomerType() {
		this.clearForm();
	}

	protected clearForm() {
		this.customerForm().patchValue({
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
