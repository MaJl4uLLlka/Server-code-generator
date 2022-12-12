import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateRepositoriesComponent } from './private-repositories.component';

describe('PrivateRepositoriesComponent', () => {
  let component: PrivateRepositoriesComponent;
  let fixture: ComponentFixture<PrivateRepositoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateRepositoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateRepositoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
