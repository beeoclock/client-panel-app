import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	QueryList,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {tap} from "rxjs";
import {ServiceState} from "@service/state/service/service.state";
import {ITableState, TableState} from "@utility/domain/table.state";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@service/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {TableService} from "@utility/table.service";
import {ServiceTableService} from "@service/presentation/component/list/service.table.service";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {OrderDirEnum} from "@utility/domain/enum";

@Component({
	selector: 'service-external-list-component',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		NgIf,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: ServiceTableService
		}
	]
})
export class ServiceExternalListComponent extends ListPage<IServiceDto> implements OnInit {

	@Input()
	public useTableStateFromStore = true;

	@Input()
	public tableState: ITableState<IServiceDto> = new TableState<IServiceDto>().toCache();

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	public override readonly getListParams = {
		orderBy: 'order',
		orderDir: OrderDirEnum.ASC
	};

	public override ngOnInit() {
		super.ngOnInit();
		this.store.select(ServiceState.tableState)
			.pipe(
				this.takeUntil(),
				tap((tableState) => {
					if (this.useTableStateFromStore) {
						this.tableState = tableState;
						this.changeDetectorRef.detectChanges();
					}
				})
			).subscribe();
	}

}
