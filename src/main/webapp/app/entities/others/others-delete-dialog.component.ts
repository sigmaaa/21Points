import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOthers } from 'app/shared/model/others.model';
import { OthersService } from './others.service';

@Component({
  selector: 'jhi-others-delete-dialog',
  templateUrl: './others-delete-dialog.component.html'
})
export class OthersDeleteDialogComponent {
  others: IOthers;

  constructor(protected othersService: OthersService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.othersService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'othersListModification',
        content: 'Deleted an others'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-others-delete-popup',
  template: ''
})
export class OthersDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ others }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OthersDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.others = others;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/others', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/others', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
