import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
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

@Component({
	selector: 'customer-select-customer-push-box-component',
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
export class SelectCustomerPushBoxComponent implements OnInit, AfterViewInit {

	@ViewChild(CustomerExternalListComponent)
	public CustomerExternalListComponent!: CustomerExternalListComponent;

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly router = inject(Router);
	public readonly logger = inject(NGXLogger);

	public selectedServiceList: ICustomer[] = [];
	public newSelectedServiceList: ICustomer[] = [];

	public multiple = true;

	@Output()
	public readonly selectedCustomerListener = new EventEmitter<void>();

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.CustomerExternalListComponent.mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {first: cardListComponent} = mobileLayoutListComponent.cardListComponents;
		cardListComponent.selectedIds = this.newSelectedServiceList.map((service) => service._id);
		cardListComponent.showAction.doFalse();
		cardListComponent.showSelectedStatus.doTrue();
		cardListComponent.goToDetailsOnSingleClick = false;
		cardListComponent.singleClickEmitter.subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
		});
	}

	public async submit(): Promise<ICustomer[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public select(service: ICustomer): void {
		if (!this.multiple) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push({...service});

		this.selectedCustomerListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public deselect(service: ICustomer): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter((selectedMember: ICustomer) => selectedMember._id !== service._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: ICustomer): boolean {
		return this.newSelectedServiceList.some((selectedMember: ICustomer) => selectedMember._id === service._id);
	}

	public isNotSelected(service: ICustomer): boolean {
		return !this.isSelected(service);
	}
}
