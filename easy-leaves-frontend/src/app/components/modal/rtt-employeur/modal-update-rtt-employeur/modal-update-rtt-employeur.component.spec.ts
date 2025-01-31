import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateRttEmployeurComponent } from './modal-update-rtt-employeur.component';

describe('ModalUpdateRttEmployeurComponent', () => {
  let component: ModalUpdateRttEmployeurComponent;
  let fixture: ComponentFixture<ModalUpdateRttEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUpdateRttEmployeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalUpdateRttEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
