import {Component, HostBinding, inject, ViewEncapsulation} from "@angular/core";
import {
	PushBoxResizeContainerComponent
} from "@utility/presentation/component/push-box/push-box.resize-container.component";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {AsyncPipe, NgIf} from "@angular/common";

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
		<utility-push-box-resize-container *ngIf="isNotMobile$ | async"/>
		<ng-content/>
	`
})
export class PushBoxContainerComponent {

	@HostBinding()
	public class = 'sm:w-[375px] sm:min-w-[375px] sm:max-w-[375px] w-full bg-beeColor-50 lg:border-l-4';

	private readonly windowWidthSizeService = inject(WindowWidthSizeService);
	public readonly isNotMobile$ = this.windowWidthSizeService.isNotMobile$

}
