import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AppTestModule } from '../../../test.module';
import { PointsComponent } from 'app/entities/points/points.component';
import { PointsService } from 'app/entities/points/points.service';
import { Points } from 'app/shared/model/points.model';

describe('Component Tests', () => {
  describe('Points Management Component', () => {
    let comp: PointsComponent;
    let fixture: ComponentFixture<PointsComponent>;
    let service: PointsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppTestModule],
        declarations: [PointsComponent],
        providers: []
      })
        .overrideTemplate(PointsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PointsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PointsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Points(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.points[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
