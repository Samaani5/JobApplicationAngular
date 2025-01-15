import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalJobApplicationDetailsComponent } from './final-job-application-details.component';

describe('FinalJobApplicationDetailsComponent', () => {
  let component: FinalJobApplicationDetailsComponent;
  let fixture: ComponentFixture<FinalJobApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalJobApplicationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalJobApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
