import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDivisionListComponent } from './group-division-list.component';

describe('GroupDivisionListComponent', () => {
  let component: GroupDivisionListComponent;
  let fixture: ComponentFixture<GroupDivisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDivisionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDivisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
