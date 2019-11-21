import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { IOthers } from 'app/shared/model/others.model';
import { OthersService } from './others.service';

@Component({
  selector: 'jhi-others',
  templateUrl: './others.component.html'
})
export class OthersComponent implements OnInit, OnDestroy {
  others: IOthers[];
  eventSubscriber: Subscription;

  constructor(protected othersService: OthersService, protected dataUtils: JhiDataUtils, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.othersService.query().subscribe((res: HttpResponse<IOthers[]>) => {
      this.others = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInOthers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOthers) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInOthers() {
    this.eventSubscriber = this.eventManager.subscribe('othersListModification', () => this.loadAll());
  }
}
