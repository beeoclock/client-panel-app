import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	input,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {CustomerExternalListComponent} from "@customer/presentation/component/external/list/list.component";
import {ICustomer} from "@customer/domain";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'customer-select-customer-whac-a-mole-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		LoaderComponent,
		NgIf,
		TranslateModule,
		CurrencyPipe,
		HumanizeDurationPipe,
		PrimaryButtonDirective,
		CustomerExternalListComponent
	],
	template: `
		<customer-external-list-component [mobileMode]="true"/>
	`
})
export class SelectCustomerPushBoxComponent extends Reactive implements OnInit, AfterViewInit {

	@ViewChild(CustomerExternalListComponent)
	public customerExternalListComponent!: CustomerExternalListComponent;

	public readonly selectedCustomerList = input<ICustomer[]>([]);

	@Input()
	public newSelectedCustomerList: ICustomer[] = [];

	public readonly multiple = input(true);

	@Output()
	public readonly selectedCustomerListener = new EventEmitter<ICustomer[]>();

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly router = inject(Router);
	public readonly logger = inject(NGXLogger);

	public ngOnInit(): void {

		this.newSelectedCustomerList = [...(this.selectedCustomerList() ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.customerExternalListComponent.mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {first: cardListComponent} = mobileLayoutListComponent.cardListComponents;
		cardListComponent.selectedIds = this.newSelectedCustomerList.map((customer) => customer._id);
		cardListComponent.showAction.doFalse();
		cardListComponent.showSelectedStatus.doTrue();
		cardListComponent.goToDetailsOnSingleClick = false;
		cardListComponent.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
			cardListComponent.selectedIds = this.newSelectedCustomerList.map(({_id}) => _id);
			cardListComponent.changeDetectorRef.detectChanges();
		});
	}

	public async submit(): Promise<ICustomer[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedCustomerList);
		});
	}

	public select(service: ICustomer): void {
		if (!this.multiple()) {
			if (this.newSelectedCustomerList.length) {
				this.newSelectedCustomerList.splice(0, 1);
			}
		}
		this.newSelectedCustomerList.push({...service});

		this.selectedCustomerListener.emit(this.newSelectedCustomerList);
		this.changeDetectorRef.detectChanges();
	}

	public deselect(service: ICustomer): void {
		this.newSelectedCustomerList = this.newSelectedCustomerList.filter((selectedMember: ICustomer) => selectedMember._id !== service._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: ICustomer): boolean {
		return this.newSelectedCustomerList.some((selectedMember: ICustomer) => selectedMember._id === service._id);
	}

	public isNotSelected(service: ICustomer): boolean {
		return !this.isSelected(service);
	}
}
