import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDivisionListComponent } from './sub-division-list.component';

describe('SubDivisionListComponent', () => {
  let component: SubDivisionListComponent;
  let fixture: ComponentFixture<SubDivisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubDivisionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubDivisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
