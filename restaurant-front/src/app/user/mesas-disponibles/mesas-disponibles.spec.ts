import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasDisponibles } from './mesas-disponibles';

describe('MesasDisponibles', () => {
  let component: MesasDisponibles;
  let fixture: ComponentFixture<MesasDisponibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasDisponibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasDisponibles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
