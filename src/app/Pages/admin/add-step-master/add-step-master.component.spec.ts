import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStepMasterComponent } from './add-step-master.component';

describe('AddStepMasterComponent', () => {
  let component: AddStepMasterComponent;
  let fixture: ComponentFixture<AddStepMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStepMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStepMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
