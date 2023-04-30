import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {DatePipe, NgForOf} from '@angular/common';
import * as Event from '@event/domain';
import {QueryDocumentSnapshot} from '@angular/fire/compat/firestore';
import {EventFormRepository} from '@event/repository/event.form.repository';
import {Functions, httpsCallableData} from '@angular/fire/functions';

@Component({
  selector: 'event-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent,
    CardComponent,
    BodyCardComponent,
    RouterLink,
    ButtonComponent,
    TableComponent,
    HeaderTableComponent,
    BodyTableComponent,
    PaginationComponent,
    NgForOf,
    DatePipe
  ],
  standalone: true
})
export default class Index implements OnInit {
  public readonly eventFormAdapt: EventFormRepository = inject(EventFormRepository);

  public list: QueryDocumentSnapshot<Event.IEvent>[] = [];
  public readonly functions = inject(Functions)

  public ngOnInit() {
    const eventListGet = httpsCallableData(this.functions, 'eventListGet', {

    });
    eventListGet().subscribe((data) => {
      console.log(data);
    });
  }

  constructor() {
    this.eventFormAdapt.list().then((list) => {
      console.log(list);
      this.list = list.docs;
    });
  }
}
