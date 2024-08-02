import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
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
	IonToolbar
} from "@ionic/angular/standalone";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormAttendantComponent} from "@event/presentation/component/form/attendees/attendant/form.attendant.component";
import {
	NamesFormAttendantComponent
} from "@event/presentation/component/form/attendees/attendant/names.form.attendant.component";
import {TranslateModule} from "@ngx-translate/core";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";

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
		TranslateModule
	],
	template: `
		<ion-header>
			<ion-toolbar>

				<ion-segment [formControl]="segmentFormControl">
					<ion-segment-button [value]="customerTypeEnum.regular">
						<ion-label>Regular</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.new">
						<ion-label>New</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.unregistered">
						<ion-label>Guest</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="customerTypeEnum.anonymous">
						<ion-label>Anonymous</ion-label>
					</ion-segment-button>
				</ion-segment>
			</ion-toolbar>
		</ion-header>
		<ion-content scroll-y="false" class="ion-padding" [ngSwitch]="segmentFormControl.value">
			<ng-container *ngSwitchCase="customerTypeEnum.anonymous">
				{{ 'keyword.capitalize.anonymous' | translate }}
			</ng-container>
			<ng-container *ngSwitchCase="customerTypeEnum.new">
				<app-event-form-attendant-component class="p-4 block" [form]="customerForm"/>
			</ng-container>
			<ng-container *ngSwitchCase="customerTypeEnum.unregistered">
				<app-event-names-form-attendant-component class="p-4" [form]="customerForm"/>
			</ng-container>
			<ng-container *ngSwitchCase="customerTypeEnum.regular">
				<ion-searchbar [debounce]="1000" (ionInput)="handleInput($event)"></ion-searchbar>
				<ion-list>
					<ion-item lines="full" [button]="true" [detailIcon]="false" *ngFor="let result of results">
						<ion-avatar aria-hidden="true" slot="start">
							<img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
						</ion-avatar>
						<ion-label>
							{{ result }}</ion-label>
						<ion-checkbox slot="end" [value]="0" [checked]="isChecked(result)" (ionChange)="checkboxChange($event)">
						</ion-checkbox>
					</ion-item>
				</ion-list>
			</ng-container>

		</ion-content>
	`
})
export class CustomerListIonicComponent {

	@Input({ required: true })
	public customerForm!: CustomerForm;

	readonly #listCustomerApiAdapter = inject(ListCustomerApiAdapter);

	public readonly segmentFormControl = new FormControl(CustomerTypeEnum.anonymous);

	public data = [
		'Amsterdam',
		'Buenos Aires',
		'Cairo',
		'Geneva',
		'Hong Kong',
		'Istanbul',
		'London',
		'Madrid',
		'New York',
		'Panama City',
		'Amsterdam',
		'Buenos Aires',
		'Cairo',
		'Geneva',
		'Hong Kong',
		'Istanbul',
		'London',
		'Madrid',
		'New York',
		'Panama City',
	];
	public results = [...this.data];

	handleInput(event: any) {
		console.log(event)
		const query = event.target.value.toLowerCase();
		this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
	}

	checkboxChange($event: any) {
		console.log($event)
	}

	isChecked(result: string) {
		return this.data.includes(result);
	}

	onIonInfinite($event: any) {
		console.log($event)
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;
}
