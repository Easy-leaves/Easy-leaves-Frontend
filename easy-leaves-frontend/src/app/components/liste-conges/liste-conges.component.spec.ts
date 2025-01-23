import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListeCongesComponent } from './app-liste-conges.component';

describe('AppListeCongesComponent', () => {
  let component: AppListeCongesComponent;
  let fixture: ComponentFixture<AppListeCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppListeCongesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppListeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
