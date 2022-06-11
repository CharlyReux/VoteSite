import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyUserPageComponent } from './identify-user-page.component';

describe('IdentifyUserPageComponent', () => {
  let component: IdentifyUserPageComponent;
  let fixture: ComponentFixture<IdentifyUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifyUserPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
