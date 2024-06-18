import {Component, ElementRef, HostBinding, HostListener, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {combineLatest} from 'rxjs';
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {Reactive} from "@utility/cdk/reactive";

@Component({
  selector: 'whac-a-mole-resize-container',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: ``
})
export class WhacAMoleResizeContainer extends Reactive implements OnInit {
  @HostBinding()
  public class =
    'absolute right-full top-0 bottom-0 w-1 bg-neutral-200 transition-all hover:bg-blue-300 hover:shadow cursor-col-resize';

  @HostBinding('class.hidden')
  public isHidden = false;

  private readonly elementRef = inject(ElementRef);
  private readonly windowWidthSizeService = inject(WindowWidthSizeService);

  public readonly isNotTablet$ = this.windowWidthSizeService.isNotTablet$;
  public readonly isNotMobile$ = this.windowWidthSizeService.isNotMobile$;
  public isNotMobile = false;
  public isNotTabletAndMobile = false;

  public width = +(localStorage.getItem('whac-a-mole-width') ?? '0');

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
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
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  }

  public ngOnInit() {
    combineLatest([this.isNotTablet$, this.isNotMobile$])
      .pipe(this.takeUntil())
      .subscribe(({ 0: isNotTablet, 1: isNotMobile }) => {
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

    const { parentElement } = this.elementRef.nativeElement as { parentElement: HTMLElement };

    if (parentElement!.classList.contains('sm:min-w-[375px]')) {
      this.deleteClasses(parentElement!, 'sm:min-w-[375px]', 'sm:max-w-[375px]', 'sm:w-[375px]');
      this.deleteClasses(parentElement!.parentElement!, 'lg:min-w-[375px]', 'lg:max-w-[375px]');
    }

    parentElement!.style.width = this.isNotMobile ? `${width}px` : '';
    parentElement!.parentElement!.style.width = this.isNotTabletAndMobile ? `${width}px` : '';
  }

  private deleteClasses(from: HTMLElement, ...classes: string[]) {
    classes.forEach((className) => {
      from.classList.remove(className);
    });
  }
}
