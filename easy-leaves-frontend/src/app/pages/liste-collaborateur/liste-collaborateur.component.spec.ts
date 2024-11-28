import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCollaborateurComponent } from './liste-collaborateur.component';

describe('ListeCollaborateurComponent', () => {
  let component: ListeCollaborateurComponent;
  let fixture: ComponentFixture<ListeCollaborateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCollaborateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeCollaborateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
