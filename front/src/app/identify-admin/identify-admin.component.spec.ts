import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyAdminComponent } from './identify-admin.component';

describe('IdentifyAdminComponent', () => {
  let component: IdentifyAdminComponent;
  let fixture: ComponentFixture<IdentifyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifyAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
