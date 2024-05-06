import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {
	PushBoxResizeContainerComponent
} from "@utility/presentation/component/push-box/push-box.resize-container.component";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'utility-push-box-container',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		PushBoxResizeContainerComponent,
		NgIf,
		AsyncPipe
	],
	template: `
		<utility-push-box-resize-container/>
		<ng-content/>
	`
})
export class PushBoxContainerComponent extends Reactive implements OnInit {

	@HostBinding()
	public class = 'sm:w-[375px] sm:min-w-[375px] sm:max-w-[375px] w-full bg-beeColor-50';

	@HostBinding('class.relative')
	public relative = false;

	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	public ngOnInit() {
		this.windowWidthSizeService.isTablet$.pipe(
			this.takeUntil(),
		).subscribe((isTablet) => {
			this.relative = isTablet;
		});
	}

}
