import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipApplicationComponent } from './internship-application.component';

describe('InternshipApplicationComponent', () => {
  let component: InternshipApplicationComponent;
  let fixture: ComponentFixture<InternshipApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
