import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCongeComponent } from './gestion-absences.component';

describe('GestionAbsencesComponent', () => {
  let component: GestionCongeComponent;
  let fixture: ComponentFixture<GestionCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCongeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
