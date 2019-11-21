import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IPoints } from 'app/shared/model/points.model';
import { PointsService } from './points.service';

@Component({
  selector: 'jhi-points',
  templateUrl: './points.component.html'
})
export class PointsComponent implements OnInit, OnDestroy {
  points: IPoints[];
  eventSubscriber: Subscription;

  constructor(protected pointsService: PointsService, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.pointsService.query().subscribe((res: HttpResponse<IPoints[]>) => {
      this.points = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInPoints();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPoints) {
    return item.id;
  }

  registerChangeInPoints() {
    this.eventSubscriber = this.eventManager.subscribe('pointsListModification', () => this.loadAll());
  }
}
