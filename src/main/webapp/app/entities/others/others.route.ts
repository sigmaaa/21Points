import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Others } from 'app/shared/model/others.model';
import { OthersService } from './others.service';
import { OthersComponent } from './others.component';
import { OthersDetailComponent } from './others-detail.component';
import { OthersUpdateComponent } from './others-update.component';
import { OthersDeletePopupComponent } from './others-delete-dialog.component';
import { IOthers } from 'app/shared/model/others.model';

@Injectable({ providedIn: 'root' })
export class OthersResolve implements Resolve<IOthers> {
  constructor(private service: OthersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOthers> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((others: HttpResponse<Others>) => others.body));
    }
    return of(new Others());
  }
}

export const othersRoute: Routes = [
  {
    path: '',
    component: OthersComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Others'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OthersDetailComponent,
    resolve: {
      others: OthersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Others'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OthersUpdateComponent,
    resolve: {
      others: OthersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Others'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OthersUpdateComponent,
    resolve: {
      others: OthersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Others'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const othersPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OthersDeletePopupComponent,
    resolve: {
      others: OthersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Others'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
