import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'album',
        loadChildren: () => import('./album/album.module').then(m => m.AppAlbumModule)
      },
      {
        path: 'photo',
        loadChildren: () => import('./photo/photo.module').then(m => m.AppPhotoModule)
      },
      {
        path: 'points',
        loadChildren: () => import('./points/points.module').then(m => m.AppPointsModule)
      },
      {
        path: 'others',
        loadChildren: () => import('./others/others.module').then(m => m.AppOthersModule)
      },
      {
        path: 'tag',
        loadChildren: () => import('./tag/tag.module').then(m => m.AppTagModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class AppEntityModule {}
