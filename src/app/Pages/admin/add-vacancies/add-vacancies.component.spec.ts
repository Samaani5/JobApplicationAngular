import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVacanciesComponent } from './add-vacancies.component';

describe('AddVacanciesComponent', () => {
  let component: AddVacanciesComponent;
  let fixture: ComponentFixture<AddVacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVacanciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
