import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogrammeCongesComponent } from './histogramme-conges.component';

describe('HistogrammeCongesComponent', () => {
  let component: HistogrammeCongesComponent;
  let fixture: ComponentFixture<HistogrammeCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistogrammeCongesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistogrammeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
