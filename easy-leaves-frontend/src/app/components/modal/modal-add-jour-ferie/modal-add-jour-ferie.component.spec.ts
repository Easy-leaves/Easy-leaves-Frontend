import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddJourFerieComponent } from './modal-add-jour-ferie.component';

describe('ModalAddJourFerieComponent', () => {
  let component: ModalAddJourFerieComponent;
  let fixture: ComponentFixture<ModalAddJourFerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddJourFerieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAddJourFerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
