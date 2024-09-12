import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalhtmlComponent } from './modalhtml.component';

describe('ModalhtmlComponent', () => {
  let component: ModalhtmlComponent;
  let fixture: ComponentFixture<ModalhtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalhtmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalhtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
