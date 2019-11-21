import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AppTestModule } from '../../../test.module';
import { OthersComponent } from 'app/entities/others/others.component';
import { OthersService } from 'app/entities/others/others.service';
import { Others } from 'app/shared/model/others.model';

describe('Component Tests', () => {
  describe('Others Management Component', () => {
    let comp: OthersComponent;
    let fixture: ComponentFixture<OthersComponent>;
    let service: OthersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppTestModule],
        declarations: [OthersComponent],
        providers: []
      })
        .overrideTemplate(OthersComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OthersComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OthersService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Others(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.others[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
