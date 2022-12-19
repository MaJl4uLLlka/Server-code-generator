import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRepositoryComponent } from './delete-repository.component';

describe('DeleteRepositoryComponent', () => {
  let component: DeleteRepositoryComponent;
  let fixture: ComponentFixture<DeleteRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
