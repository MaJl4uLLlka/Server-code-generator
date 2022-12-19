import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRepositoryComponent } from './update-repository.component';

describe('UpdateRepositoryComponent', () => {
  let component: UpdateRepositoryComponent;
  let fixture: ComponentFixture<UpdateRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
