import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionJourFeriesComponent } from './gestion-jour-feries.component';

describe('GestionJourFeriesComponent', () => {
  let component: GestionJourFeriesComponent;
  let fixture: ComponentFixture<GestionJourFeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionJourFeriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionJourFeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
