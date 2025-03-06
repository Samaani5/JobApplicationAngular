import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepMasterListComponent } from './step-master-list.component';

describe('StepMasterListComponent', () => {
  let component: StepMasterListComponent;
  let fixture: ComponentFixture<StepMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepMasterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
