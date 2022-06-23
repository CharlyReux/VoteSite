import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapPageComponent } from './recap-page.component';

describe('RecapPageComponent', () => {
  let component: RecapPageComponent;
  let fixture: ComponentFixture<RecapPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecapPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
