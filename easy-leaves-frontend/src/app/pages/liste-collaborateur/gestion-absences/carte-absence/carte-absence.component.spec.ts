import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteAbsenceComponent } from './carte-absence.component';

describe('CarteAbsenceComponent', () => {
  let component: CarteAbsenceComponent;
  let fixture: ComponentFixture<CarteAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteAbsenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarteAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
