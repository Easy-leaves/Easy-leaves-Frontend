import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRttEmployeurComponent } from './gestion-rtt-employeur.component';

describe('GestionRttEmployeurComponent', () => {
  let component: GestionRttEmployeurComponent;
  let fixture: ComponentFixture<GestionRttEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRttEmployeurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionRttEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
