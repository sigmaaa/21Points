import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { OthersDetailComponent } from 'app/entities/others/others-detail.component';
import { Others } from 'app/shared/model/others.model';

describe('Component Tests', () => {
  describe('Others Management Detail Component', () => {
    let comp: OthersDetailComponent;
    let fixture: ComponentFixture<OthersDetailComponent>;
    const route = ({ data: of({ others: new Others(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppTestModule],
        declarations: [OthersDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OthersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OthersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.others).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
