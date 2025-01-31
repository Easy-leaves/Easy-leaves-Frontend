import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteRttEmployeurComponent } from './modal-delete-rtt-employeur.component';

describe('ModalDeleteRttEmployeurComponent', () => {
  let component: ModalDeleteRttEmployeurComponent;
  let fixture: ComponentFixture<ModalDeleteRttEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteRttEmployeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDeleteRttEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
