import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Photo } from 'app/shared/model/photo.model';
import { PhotoService } from './photo.service';
import { PhotoComponent } from './photo.component';
import { PhotoDetailComponent } from './photo-detail.component';
import { PhotoUpdateComponent } from './photo-update.component';
import { PhotoDeletePopupComponent } from './photo-delete-dialog.component';
import { IPhoto } from 'app/shared/model/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoResolve implements Resolve<IPhoto> {
  constructor(private service: PhotoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhoto> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((photo: HttpResponse<Photo>) => photo.body));
    }
    return of(new Photo());
  }
}

export const photoRoute: Routes = [
  {
    path: '',
    component: PhotoComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Photos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PhotoDetailComponent,
    resolve: {
      photo: PhotoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Photos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PhotoUpdateComponent,
    resolve: {
      photo: PhotoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Photos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PhotoUpdateComponent,
    resolve: {
      photo: PhotoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Photos'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const photoPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PhotoDeletePopupComponent,
    resolve: {
      photo: PhotoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Photos'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
