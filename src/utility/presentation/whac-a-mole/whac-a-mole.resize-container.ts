import {
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	OnInit,
	output,
	Renderer2,
	ViewEncapsulation
} from '@angular/core';
import {combineLatest} from 'rxjs';
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {Reactive} from "@utility/cdk/reactive";
import {DOCUMENT} from "@angular/common";

@Component({
	selector: 'whac-a-mole-resize-container',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: ``,
	host: {
		class: 'absolute left-0 top-0 bottom-0 w-1 bg-neutral-200 transition-all hover:bg-blue-300 hover:shadow cursor-col-resize'
	}
})
export class WhacAMoleResizeContainer extends Reactive implements OnInit {

	@HostBinding('class.hidden')
	public isHidden = false;

	public width = +(localStorage.getItem('whac-a-mole-width') ?? '0');

	public readonly widthChanges = output<number>();
	public readonly mouseDownUp = output<boolean>();

	private readonly elementRef = inject(ElementRef);
	private readonly windowWidthSizeService = inject(WindowWidthSizeService);
	private readonly renderer2 = inject(Renderer2);
	private readonly document = inject(DOCUMENT);

	public readonly isNotTablet$ = this.windowWidthSizeService.isNotTablet$;
	public readonly isNotMobile$ = this.windowWidthSizeService.isNotMobile$;
	public isNotMobile = false;
	public isNotTabletAndMobile = false;

	readonly #unlisten = {
		mousemove: () => {
		},
		mouseup: () => {
		},
		touchmove: () => {
		},
		touchend: () => {
		},
	};

	@HostListener('mousedown', ['$event'])
	public onMouseDown(event: MouseEvent): void {
		this.mouseDownUp.emit(true);
		event.preventDefault();

		const startX = event.clientX;
		const startWidth = this.elementRef.nativeElement.parentElement?.clientWidth || 0;

		const onMouseMove = (moveEvent: MouseEvent) => {
			const diff = moveEvent.clientX - startX;

			const newWidth = startWidth - diff;

			this.updateWidth(newWidth);

			this.saveWidth(newWidth);
		};

		const onMouseUp = () => {
			this.mouseDownUp.emit(false);
			this.#unlisten.mousemove();
			this.#unlisten.mouseup();
		};

		this.#unlisten.mousemove = this.renderer2.listen(this.document, 'mousemove', onMouseMove);
		this.#unlisten.mouseup = this.renderer2.listen(this.document, 'mouseup', onMouseUp);
	}

	@HostListener('touchstart', ['$event'])
	public onTouchStart(event: TouchEvent): void {
		event.preventDefault();

		const startX = event.touches[0].clientX;
		const startWidth = this.elementRef.nativeElement.parentElement?.clientWidth || 0;

		const onTouchMove = (moveEvent: TouchEvent) => {
			const diff = moveEvent.touches[0].clientX - startX;

			const newWidth = startWidth - diff;

			this.updateWidth(newWidth);

			this.saveWidth(newWidth);
		};

		const onTouchEnd = () => {
			this.#unlisten.touchmove();
			this.#unlisten.touchend();
		};

		this.#unlisten.touchmove = this.renderer2.listen(this.document, 'touchmove', onTouchMove);
		this.#unlisten.touchend = this.renderer2.listen(this.document, 'touchend', onTouchEnd);
	}

	public ngOnInit() {
		combineLatest([this.isNotTablet$, this.isNotMobile$])
			.pipe(this.takeUntil())
			.subscribe(({0: isNotTablet, 1: isNotMobile}) => {
				this.isHidden = !isNotMobile;
				this.isNotTabletAndMobile = isNotTablet && isNotMobile;
				this.isNotMobile = isNotMobile;
				this.updateWidth(+this.width);
			});
	}

	public saveWidth(width: number) {
		localStorage.setItem('whac-a-mole-width', width.toString());
	}

	public updateWidth(width: number) {
		if (!width) {
			return;
		}

		const parentElement = this.renderer2.parentNode(this.elementRef.nativeElement);
		const parentElementOfParentElement = this.renderer2.parentNode(parentElement);

		if (parentElement!.classList.contains('sm:min-w-[375px]')) {
			this.deleteClasses(parentElement, 'sm:min-w-[375px]', 'sm:max-w-[375px]', 'sm:w-[375px]');
			this.deleteClasses(parentElementOfParentElement, 'lg:min-w-[375px]', 'lg:max-w-[375px]');
		}

		this.renderer2.setStyle(parentElement, 'width', `${width}px`);
		this.renderer2.setStyle(parentElementOfParentElement, 'max-width', this.isNotTabletAndMobile ? `${width}px` : '');
		this.widthChanges.emit(width);
	}

	private deleteClasses(from: HTMLElement, ...classes: string[]) {
		classes.forEach((className) => {
			this.renderer2.removeClass(from, className);
		});
	}
}
