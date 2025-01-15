import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVacancyListComponent } from './post-vacancy-list.component';

describe('PostVacancyListComponent', () => {
  let component: PostVacancyListComponent;
  let fixture: ComponentFixture<PostVacancyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostVacancyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostVacancyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
