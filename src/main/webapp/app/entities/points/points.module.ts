import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppSharedModule } from 'app/shared/shared.module';
import { PointsComponent } from './points.component';
import { PointsDetailComponent } from './points-detail.component';
import { PointsUpdateComponent } from './points-update.component';
import { PointsDeletePopupComponent, PointsDeleteDialogComponent } from './points-delete-dialog.component';
import { pointsRoute, pointsPopupRoute } from './points.route';

const ENTITY_STATES = [...pointsRoute, ...pointsPopupRoute];

@NgModule({
  imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [PointsComponent, PointsDetailComponent, PointsUpdateComponent, PointsDeleteDialogComponent, PointsDeletePopupComponent],
  entryComponents: [PointsDeleteDialogComponent]
})
export class AppPointsModule {}
