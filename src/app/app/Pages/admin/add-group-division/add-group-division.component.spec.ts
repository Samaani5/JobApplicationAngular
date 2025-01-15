import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupDivisionComponent } from './add-group-division.component';

describe('AddGroupDivisionComponent', () => {
  let component: AddGroupDivisionComponent;
  let fixture: ComponentFixture<AddGroupDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupDivisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
