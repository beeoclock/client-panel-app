import {AfterViewInit, Component, inject, Input, TemplateRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {Popover} from "bootstrap";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'utility-popover',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <button
      (click)="showPopover()"
      [id]="id"
      type="button"
      class="btn btn-link px-2"
      data-bs-toggle="popover">
      <ng-content select="[button]"></ng-content>
    </button>

    <ng-template #popoverContent>
      <ng-content select="[content]"></ng-content>
    </ng-template>
  `
})
export class PopoverComponent implements AfterViewInit {

  @ViewChild('popoverContent', {read: TemplateRef})
  popoverContent!: TemplateRef<any>;

  @Input()
  public id = 'utility-popover-btn';

  public popover!: Popover;
  public popoverIsShow = false;

  private readonly document: Document = inject(DOCUMENT);

  public clickHandler = ($event: Event) => {
    this.popoverIsShow && ($event.target as HTMLElement).id !== this.id && this.hide();
  };

  public stopPropagation = ($event: Event) => {
    const li: HTMLLIElement | undefined = $event.target as HTMLLIElement | undefined;
    if (li?.hasAttribute('close-on-self-click') || li?.parentElement?.hasAttribute('close-on-self-click')) {
      this.hide();
    }
    $event.stopPropagation();
  };

  public ngAfterViewInit(): void {
    const content = this.popoverContent.createEmbeddedView(this.popoverContent).rootNodes[0];
    if (!content) {
      throw new Error('Content is empty!');
    }
    this.popover = new Popover(`utility-popover > [id="${this.id}"][data-bs-toggle="popover"]`, {
      container: 'body',
      placement: 'bottom',
      trigger: 'manual',
      html: true,
      template: `
        <div class="popover" role="tooltip">
          <div class="popover-arrow"></div>
          <h3 class="popover-header"></h3>
          <div class="popover-inner"></div>
          <div class="popover-body p-0"></div>
        </div>
      `,
      content
    });
  }

  public showPopover(): void {
    this.popoverIsShow ? this.hide() : this.show();
  }

  public show(): void {
    this.popover.show();
    this.document.body.addEventListener('click', this.clickHandler);
    this.popoverContent.createEmbeddedView(this.popoverContent).rootNodes[0].addEventListener('click', this.stopPropagation);
    this.popoverIsShow = true;
  }

  public hide(): void {
    this.popover.hide();
    this.document.body.removeEventListener('click', this.clickHandler);
    this.popoverContent.createEmbeddedView(this.popoverContent).rootNodes[0].removeEventListener('click', this.stopPropagation);
    this.popoverIsShow = false;
  }

}

