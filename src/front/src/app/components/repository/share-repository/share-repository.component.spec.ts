import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRepositoryComponent } from './share-repository.component';

describe('ShareRepositoryComponent', () => {
  let component: ShareRepositoryComponent;
  let fixture: ComponentFixture<ShareRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
