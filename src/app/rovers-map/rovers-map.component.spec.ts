import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RoversMapComponent} from './rovers-map.component';

describe('RoversMapComponent', () => {
  let component: RoversMapComponent;
  let fixture: ComponentFixture<RoversMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoversMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoversMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
