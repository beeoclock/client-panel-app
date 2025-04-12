import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	output,
	ViewEncapsulation
} from "@angular/core";
import {
	SelectServiceMultipleComponent
} from "@tenant/service/presentation/ui/component/select-list/select-service-multiple.component";
import {IService} from "@tenant/service/domain/interface/i.service";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {StateEnum} from "@core/shared/enum/state.enum";

@Component({
	selector: 'app-select-service-list-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	template: `
		@for (service of serviceList; track service._id) {
			<select-service-multiple [service]="service" (emitSelect)="select($event)"
									 (emitDeselect)="deselect($event)"/>
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

	private readonly sharedUow = inject(SharedUow);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly emitSelectedServiceList = output<IService.DTO[]>();

	public serviceList: IService.DTO[] = [];
	public readonly selectedServices: IService.DTO[] = [];

	public ngOnInit() {
		this.initServiceList().then();
	}

	public async initServiceList() {
		const result = await this.sharedUow.service.repository.findAsync({
			pageSize: 500,
			page: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
			state: StateEnum.active,
		});
		this.serviceList = result.items;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Select a service
	 * @param service
	 */
	public select(service: IService.DTO): void {
		this.selectedServices.push(service);
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

	/**
	 * Deselect a service
	 * @param service
	 */
	public deselect(service: IService.DTO): void {
		const index = this.selectedServices.indexOf(service);
		if (index >= 0) {
			this.selectedServices.splice(index, 1);
		}
		this.emitSelectedServiceList.emit(this.selectedServices);
	}

}
