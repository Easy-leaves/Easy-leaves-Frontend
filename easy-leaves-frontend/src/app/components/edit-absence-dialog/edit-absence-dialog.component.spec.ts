import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbsenceDialogComponent } from './edit-absence-dialog.component';

describe('EditAbsenceDialogComponent', () => {
  let component: EditAbsenceDialogComponent;
  let fixture: ComponentFixture<EditAbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAbsenceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
