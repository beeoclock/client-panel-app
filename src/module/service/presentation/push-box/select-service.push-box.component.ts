import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {IService} from "@service/domain";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {NGXLogger} from "ngx-logger";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";
import {ServiceExternalListComponent} from "@service/presentation/component/external/list/list.component";
import {firstValueFrom} from "rxjs";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {Reactive} from "@utility/cdk/reactive";
import {ITableState, TableState} from "@utility/domain/table.state";

@Component({
	selector: 'utility-modal-select-service-component',
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
		ServiceItemComponent,
		ServiceExternalListComponent
	],
	template: `
		<service-external-list-component [useTableStateFromStore]="useTableStateFromStore" [tableState]="tableState" [mobileMode]="true"/>
	`
})
export class SelectServicePushBoxComponent extends Reactive implements OnInit, AfterViewInit {

	@Input()
	public selectedServiceList: IService[] = [];

	@Input()
	public newSelectedServiceList: IService[] = [];

	@Output()
	public readonly selectedServicesListener = new EventEmitter<void>();

	@Input()
	public useTableStateFromStore = true;

	@Input()
	public tableState: ITableState<IService> = new TableState<IService>().toCache();

	@ViewChild(ServiceExternalListComponent)
	public serviceExternalListComponent!: ServiceExternalListComponent;

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly logger = inject(NGXLogger);

	@Input()
	public multiple = true;

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.serviceExternalListComponent.mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {first: cardListComponent} = mobileLayoutListComponent.cardListComponents;
		cardListComponent.selectedIds = this.newSelectedServiceList.map(({_id}) => _id);
		cardListComponent.showAction.doFalse();
		cardListComponent.showSelectedStatus.doTrue();
		cardListComponent.goToDetailsOnSingleClick = false;
		cardListComponent.singleClickEmitter.pipe(this.takeUntil()).subscribe((item) => {
			if (this.isSelected(item)) {
				this.deselect(item);
			} else {
				this.select(item);
			}
			cardListComponent.selectedIds = this.newSelectedServiceList.map(({_id}) => _id);
			cardListComponent.changeDetectorRef.detectChanges();
		});
	}

	public async submit(): Promise<IService[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public async select(service: IService) {
		if (!this.multiple) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push({...service});
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();

	}

	public deselect(service: IService): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter(({_id}) => _id !== service._id);
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: IService): boolean {
		return this.newSelectedServiceList.some(({_id}) => _id === service._id);
	}

	public isNotSelected(service: IService): boolean {
		return !this.isSelected(service);
	}
}
