import {AfterViewInit, Component, effect, input, viewChildren,} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {DiceRoll} from "../../dto/DiceRoll";
import {ClassicDiceChart} from "../../dto/charts/ClassicDiceChart";
import {EventDiceChart,} from "../../dto/charts/EventDiceChart";

import {MoveTimeChart} from "../../dto/charts/MoveTimeChart";
import {GameMode} from "../../dto/enums/GameMode";

@Component({
    selector: 'catan-histogram',
    imports: [
    BaseChartDirective
],
    templateUrl: './histogram.component.html',
    
    styleUrl: './histogram.component.css'
})
export class CatanHistogramComponent implements AfterViewInit {
    private charts = viewChildren(BaseChartDirective);
    
    public diceRolls = input.required<DiceRoll[]>();
    public isVisible = input<boolean>(true);
    public gameMode = input<GameMode | null>(null);
    public showExactProbability = input<boolean>(false);

    protected classicDiceChart = new ClassicDiceChart();
    protected eventDiceChart = new EventDiceChart();
    protected moveTimeChart = new MoveTimeChart();


    constructor() {
        effect(() => {
           if(this.diceRolls() && this.isVisible()) {
               this.refillChartData();
           }
        });
    }

    ngAfterViewInit(): void {
        this.refillChartData();
    }

    private refillChartData() {
        if(!this.isVisible()) return;

        const diceRolls = this.diceRolls();

        this.classicDiceChart.refresh(diceRolls, this.showExactProbability());
        this.eventDiceChart.refresh(diceRolls);
        this.moveTimeChart.refresh(diceRolls, this.gameMode());

        //update chart changes
        this.charts().forEach(chart => {
            chart.update();
        });
    }

    protected readonly GameMode = GameMode;
}
