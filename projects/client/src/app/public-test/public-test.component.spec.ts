import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTestComponent } from './public-test.component';

describe('PublicTestComponent', () => {
  let component: PublicTestComponent;
  let fixture: ComponentFixture<PublicTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
