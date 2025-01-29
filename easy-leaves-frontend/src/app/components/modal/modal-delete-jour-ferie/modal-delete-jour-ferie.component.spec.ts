import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteJourFerieComponent } from './modal-delete-jour-ferie.component';

describe('ModalDeleteJourFerieComponent', () => {
  let component: ModalDeleteJourFerieComponent;
  let fixture: ComponentFixture<ModalDeleteJourFerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteJourFerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDeleteJourFerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
