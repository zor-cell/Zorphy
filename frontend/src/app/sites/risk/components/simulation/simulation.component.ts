import {Component, effect, inject, signal} from '@angular/core';
import {RiskService} from "../../risk.service";
import {DataEntry} from "../../dto/DataEntry";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SimulationConfig} from "../../dto/SimulationConfig";
import {MainHeaderComponent} from "../../../../main/core/components/main-header/main-header.component";
import {RiskHistogramComponent} from "../histogram/histogram.component";

@Component({
  selector: 'risk-simulation',
  imports: [
    ReactiveFormsModule,
    MainHeaderComponent,
    RiskHistogramComponent
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class RiskSimulationComponent {
  private riskService = inject(RiskService);
  private fb = inject(NonNullableFormBuilder);

  protected configForm = this.fb.group({
    attackers: this.fb.control<number>(10),
    defenders: this.fb.control<number>(10),
    runs: this.fb.control<number>(100_000),
  });

  protected simulationConfig = signal(this.configForm.getRawValue() as SimulationConfig);
  protected data = signal<DataEntry[]>([]);

  constructor() {
    //set signal when form changes
    this.configForm.valueChanges.subscribe(() => {
      this.simulationConfig.set(this.configForm.getRawValue() as SimulationConfig);
    });

    //update form when signal changes
    effect(() => {
      this.configForm.patchValue(this.simulationConfig(), {emitEvent: false});
    });
  }

  protected startSimulation() {
    this.riskService.simulation(this.simulationConfig()).subscribe(res => {
      this.data.set(res);
    });
  }
}
