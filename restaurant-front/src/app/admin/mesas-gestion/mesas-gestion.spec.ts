import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasGestion } from './mesas-gestion';

describe('MesasGestion', () => {
  let component: MesasGestion;
  let fixture: ComponentFixture<MesasGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasGestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasGestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
