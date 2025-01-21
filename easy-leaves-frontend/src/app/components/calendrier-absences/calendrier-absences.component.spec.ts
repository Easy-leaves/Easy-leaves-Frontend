import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierAbsencesComponent } from './calendrier-absences.component';

describe('CalendrierAbsencesComponent', () => {
  let component: CalendrierAbsencesComponent;
  let fixture: ComponentFixture<CalendrierAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendrierAbsencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendrierAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
