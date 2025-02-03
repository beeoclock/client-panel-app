import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {Store} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {ListServiceApiAdapter} from "@service/adapter/external/api/list.service.api.adapter";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {
	SelectServiceMultipleComponent
} from "@service/presentation/component/select-list/select-service-multiple.component";

@Component({
	selector: 'app-select-service-list-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	template: `
		@for (service of serviceList.items; track service._id) {
			<select-service-multiple [service]="service" (emitSelect)="select($event)" (emitDeselect)="deselect($event)"/>
		}
	`,
	imports: [
		SelectServiceMultipleComponent
	],
	host: {
		class: 'border border-gray-200 divide-y h-full overflow-auto rounded-2xl'
	}
})
export class SelectServiceListComponent implements OnInit {

	private readonly store = inject(Store);
	private readonly listServiceApiAdapter = inject(ListServiceApiAdapter);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly emitSelectedServiceList = output<IServiceDto[]>();

	public serviceList: ResponseListType<IServiceDto> = {
		items: [],
		totalSize: 0,
	};
	public readonly selectedServices: IServiceDto[] = [];

	public ngOnInit() {
		this.initServiceList().then();
	}

	public async initServiceList() {
		this.serviceList = await this.listServiceApiAdapter.executeAsync({
			page: 1,
			pageSize: 100,
			orderBy: OrderByEnum.ORDER,
			orderDir: OrderDirEnum.ASC,
		});
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Select a service
	 * @param service
	 */
	public select(service: IServiceDto): void {
		this.selectedServices.push(service);
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

	/**
	 * Deselect a service
	 * @param service
	 */
	public deselect(service: IServiceDto): void {
		const index = this.selectedServices.indexOf(service);
		if (index >= 0) {
			this.selectedServices.splice(index, 1);
		}
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

}
