import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEntityComponent } from './update-entity.component';

describe('UpdateEntityComponent', () => {
  let component: UpdateEntityComponent;
  let fixture: ComponentFixture<UpdateEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
