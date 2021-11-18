import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildObjectTypeComponent } from './child-object-type.component';

describe('TestComponentComponent', () => {
  let component: ChildObjectTypeComponent;
  let fixture: ComponentFixture<ChildObjectTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildObjectTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildObjectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
