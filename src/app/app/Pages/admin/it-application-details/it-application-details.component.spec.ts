import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItApplicationDetailsComponent } from './it-application-details.component';

describe('ItApplicationDetailsComponent', () => {
  let component: ItApplicationDetailsComponent;
  let fixture: ComponentFixture<ItApplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItApplicationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
