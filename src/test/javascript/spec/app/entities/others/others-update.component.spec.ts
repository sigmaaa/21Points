import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { OthersUpdateComponent } from 'app/entities/others/others-update.component';
import { OthersService } from 'app/entities/others/others.service';
import { Others } from 'app/shared/model/others.model';

describe('Component Tests', () => {
  describe('Others Management Update Component', () => {
    let comp: OthersUpdateComponent;
    let fixture: ComponentFixture<OthersUpdateComponent>;
    let service: OthersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppTestModule],
        declarations: [OthersUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OthersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OthersUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OthersService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Others(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Others();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
