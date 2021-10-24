import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorStartComponent } from './generator-start.component';

describe('GeneratorStartComponent', () => {
  let component: GeneratorStartComponent;
  let fixture: ComponentFixture<GeneratorStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratorStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
