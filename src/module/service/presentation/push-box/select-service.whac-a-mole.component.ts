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
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {ServiceExternalListComponent} from "@service/presentation/component/external/list/list.component";
import {firstValueFrom} from "rxjs";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {Reactive} from "@utility/cdk/reactive";
import {ITableState, TableState} from "@utility/domain/table.state";
import {IService} from "@src/core/business-logic/service/interface/i.service";

@Component({
	selector: 'utility-modal-select-service-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ServiceExternalListComponent
	],
	template: `
		<service-external-list-component [useTableStateFromStore]="useTableStateFromStore()" [tableState]="tableState()"
										 [mobileMode]="true"/>
	`
})
export class SelectServiceWhacAMoleComponent extends Reactive implements OnInit, AfterViewInit {

	public readonly selectedServiceList = input<IService.Entity[]>([]);

	@Input()
	public newSelectedServiceList: IService.Entity[] = [];

	@Output()
	public readonly selectedServicesListener = new EventEmitter<void>();

	public readonly useTableStateFromStore = input(true);

	public readonly tableState = input<ITableState<IService.Entity>>(new TableState<IService.Entity>().toCache());

	readonly serviceExternalListComponent = viewChild.required(ServiceExternalListComponent);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly logger = inject(NGXLogger);

	public readonly multiple = input(true);

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList() ?? [])];

	}

	public ngAfterViewInit() {
		this.initializeCustomConfiguration().then();
	}

	private async initializeCustomConfiguration() {
		const mobileLayoutListComponents = await firstValueFrom<QueryList<MobileLayoutListComponent>>(this.serviceExternalListComponent().mobileLayoutListComponents.changes);
		const {first: mobileLayoutListComponent} = mobileLayoutListComponents;
		const {0: cardListComponent} = mobileLayoutListComponent.cardListComponents();
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

	public async submit(): Promise<IService.DTO[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public async select(service: IService.Entity) {
		if (!this.multiple()) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push({...service});
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();

	}

	public deselect(service: IService.DTO): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter(({_id}) => _id !== service._id);
		this.selectedServicesListener.emit();
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: IService.DTO): boolean {
		return this.newSelectedServiceList.some(({_id}) => _id === service._id);
	}

	public isNotSelected(service: IService.DTO): boolean {
		return !this.isSelected(service);
	}
}
