import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {WhacAMoleResizeContainer} from "@utility/presentation/whac-a-mole/whac-a-mole.resize-container";
import {Reactive} from "@utility/cdk/reactive";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";

@Component({
	selector: 'whac-a-mole-container',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [WhacAMoleResizeContainer, WhacAMoleResizeContainer],
	template: `
		<whac-a-mole-resize-container></whac-a-mole-resize-container>
		<ng-content></ng-content>
	`
})
export class WhacAMoleContainer extends Reactive implements OnInit {
	@HostBinding()
	public class = 'sm:w-[375px] sm:min-w-[375px] sm:max-w-[375px] w-full bg-neutral-50 overflow-hidden';

	@HostBinding('class.relative')
	public relative = false;

	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	public ngOnInit() {
		this.windowWidthSizeService.isTablet$.pipe(this.takeUntil()).subscribe((isTablet) => {
			this.relative = isTablet;
		});
	}
}
