import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationITOilComponent } from './job-application-itoil.component';

describe('JobApplicationITOilComponent', () => {
  let component: JobApplicationITOilComponent;
  let fixture: ComponentFixture<JobApplicationITOilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationITOilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicationITOilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
