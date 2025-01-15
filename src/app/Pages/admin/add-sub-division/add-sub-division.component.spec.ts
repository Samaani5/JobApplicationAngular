import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubDivisionComponent } from './add-sub-division.component';

describe('AddSubDivisionComponent', () => {
  let component: AddSubDivisionComponent;
  let fixture: ComponentFixture<AddSubDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubDivisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
