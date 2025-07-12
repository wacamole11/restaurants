import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasGestion } from './reservas-gestion';

describe('ReservasGestion', () => {
  let component: ReservasGestion;
  let fixture: ComponentFixture<ReservasGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasGestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasGestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
