import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateJourFerieComponent } from './modal-update-jour-ferie.component';

describe('ModalUpdateJourFerieComponent', () => {
  let component: ModalUpdateJourFerieComponent;
  let fixture: ComponentFixture<ModalUpdateJourFerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUpdateJourFerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUpdateJourFerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
