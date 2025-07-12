import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPlatillos } from './menu-platillos';

describe('MenuPlatillos', () => {
  let component: MenuPlatillos;
  let fixture: ComponentFixture<MenuPlatillos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPlatillos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPlatillos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
