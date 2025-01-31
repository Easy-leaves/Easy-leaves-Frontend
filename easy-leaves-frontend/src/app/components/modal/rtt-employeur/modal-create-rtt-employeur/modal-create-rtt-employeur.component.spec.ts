import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateRttEmployeurComponent } from './modal-create-rtt-employeur.component';

describe('ModalCreateRttEmployeurComponent', () => {
  let component: ModalCreateRttEmployeurComponent;
  let fixture: ComponentFixture<ModalCreateRttEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateRttEmployeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCreateRttEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
