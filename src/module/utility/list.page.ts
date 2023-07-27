import {AfterViewInit, Component, ElementRef, inject, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'utility-list-page',
  template: ``
})
export abstract class ListPage implements OnInit, AfterViewInit {

  public readonly repository: any;

  public readonly store = inject(Store);
  public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  public readonly actions!: {
    DeleteItem: any;
    ArchiveItem: any;
    GetList: any;
    UpdateTableState: any;
    ClearTableCacheAndGetList: any;
  };

  public ngAfterViewInit(): void {
    this.initOrderByAndOrderDirHandler();
  }

  public updateOrderBy(target: HTMLTableCellElement): void {
    const orderBy = target.getAttribute('data-orderBy');
    if (!orderBy) {
      const parent = target.parentElement as HTMLTableCellElement;
      if (parent) {
        this.updateOrderBy(parent);
      }
    } else {
      firstValueFrom(this.store.dispatch(new this.actions.UpdateTableState({
        orderBy
      }))).then(() => {
        this.store.dispatch(new this.actions.GetList());
      });
    }
  }

  public ngOnInit(): void {
    this.store.dispatch(new this.actions.GetList());
  }

  public delete(id: string): void {
    this.store.dispatch(new this.actions.DeleteItem({
      id
    }));
  }

  public archive(id: string): void {
    this.store.dispatch(new this.actions.ArchiveItem({
      id
    }));
  }

  public clearTableCache(): void {
    this.store.dispatch(new this.actions.ClearTableCacheAndGetList());
  }

  public pageChange($event: number): void {
    firstValueFrom(this.store.dispatch(new this.actions.UpdateTableState({
      page: $event
    }))).then(() => {
      this.store.dispatch(new this.actions.GetList());
    });
  }

  private initOrderByAndOrderDirHandler(): void {

    // orderBy and orderDir
    this.elementRef.nativeElement.querySelectorAll('th[data-orderBy]').forEach((foundElement) => {
      foundElement.classList.add('cursor-pointer');
      foundElement.addEventListener('click', ($event) => {
        if ($event.target) {
          const target = $event.target as HTMLTableCellElement;
          this.updateOrderBy(target);
        }
      })
    });
  }
}
