import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ScotlandYardService} from "../../scotland-yard.service";
import {GameState} from "../../dto/game/GameState";
import {MainHeaderComponent} from "../../../../main/components/all/main-header/main-header.component";
import {NgStyle} from "@angular/common";
import {PanContainerComponent} from "../../../../main/components/all/pan-container/pan-container.component";
import {Position} from "../../../../main/dto/all/Position";
import {GraphNode} from "../../dto/GraphNode";
import {EdgeType} from "../../dto/EdgeType";
import {HeatMapEntry} from "../../dto/HeatMapEntry";
import {NonNullableFormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HeatMapConfig} from "../../dto/HeatMapConfig";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'scotland-yard-game',
  imports: [
    MainHeaderComponent,
    PanContainerComponent,
    NgStyle,
    ReactiveFormsModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class ScotlandYardGameComponent implements OnInit{
  private fb = inject(NonNullableFormBuilder);
  protected scotlandYardService = inject(ScotlandYardService);

  protected gameState = signal<GameState | null>(null);
  protected heatMap = signal<HeatMapEntry[]>([]);

  protected heatMapForm = this.fb.group({
    startNode: this.fb.control<number>(67),
    moves: this.fb.control<EdgeType[]>([]),
    playerNodes: this.fb.control<number[]>([])
  })
  protected selectedMoveControl = this.fb.control<EdgeType>(EdgeType.TAXI);
  protected selectedPlayerControl = this.fb.control<number>(13);
  protected startPosition = toSignal(this.heatMapForm.controls.startNode.valueChanges, {initialValue: this.heatMapForm.controls.startNode.value});
  protected moves = toSignal(this.heatMapForm.controls.moves.valueChanges);
  protected players = toSignal(this.heatMapForm.controls.playerNodes.valueChanges);

  protected edgeTypes = Object.values(EdgeType);
  private nodeSize = 30;

  constructor() {
    this.heatMapForm.valueChanges.subscribe(change => {
      this.getHeatMap();
    })
  }

  protected bounds = computed((): Position => {
    const state = this.gameState();
    if(!state) return {x: 0, y: 0};

    let maxX = 0;
    let maxY = 0;
    state.map.forEach(item => {
      maxX = Math.max(maxX, item.node.position.x);
      maxY = Math.max(maxY, item.node.position.y);
    })

    return {x: maxX, y: maxY};
  })

  protected renderedStart = computed(() => {
    const nodes = this.gameState()?.map;
    const start = this.startPosition();

    if(!nodes) return undefined;

    return nodes.find(n => start === n.node.id);
  })

  protected renderedPlayers = computed(() => {
    const players = this.players();
    const nodes = this.gameState()?.map;

    if(!players || !nodes) return [];

    return nodes.filter(n => players.includes(n.node.id));
  })

  protected renderedNodes = computed(() => {
    const state = this.gameState();
    const heatMap = this.heatMap();

    if(!state) return [];

    if(heatMap.length === 0) {
      return state.map;
    }

    const nodes = [];
    for(const entry of heatMap) {
      const found =  state.map.find(x => x.node.id === entry.node.id);
      if(found) {
        nodes.push(found);
      }
    }

   return nodes;
  });

  protected renderedEdges = computed(() => {
    const edges: any[] = [];
    const state = this.gameState();
    if(!state) return edges;

    for(const graphNode of state.map) {
      graphNode.edges.forEach(e => {
        const start = graphNode.node;
        const end = e.to;

        const found = edges.find(x => x.id == `${start.id}-${end.id}`);
        if(!found) {
          edges.push({
            id: `${start.id}-${end.id}`,
            x1: start.position.x,
            y1: start.position.y,
            x2: end.position.x,
            y2: end.position.y,
            type: e.type
          });
        }
      });
    }

    return edges;
  });

  ngOnInit() {
    this.getSession();
  }

  protected getNodePositionStyle(position: Position, incr: number = 0) {
    return {
      left: `${position.x - this.nodeSize / 2 - (incr / 2) * this.nodeSize / 2}px`,
      top: `${position.y - this.nodeSize / 2 - (incr / 2) * this.nodeSize / 2}px`,
      width: `${this.nodeSize + incr * this.nodeSize / 2}px`,
      height: `${this.nodeSize + incr * this.nodeSize / 2}px`
    }
  }

  protected getNodeColorClasses(entry: GraphNode) {
    let classes = '';
    for(const edge of entry.edges) {
      if(edge.type === EdgeType.TAXI && !classes.includes('taxi')) {
        classes += 'taxi ';
      } else if(edge.type === EdgeType.BUS && !classes.includes('bus')) {
        classes += 'bus ';
      } else if(edge.type === EdgeType.METRO && !classes.includes('metro')) {
        classes += 'metro ';
      }
    }

    return classes;
  }

  protected addMove() {
    const move = this.selectedMoveControl.value;
    if (move) {
      const moveControl = this.heatMapForm.controls.moves;
      const currentMoves = moveControl.value;

      this.heatMapForm.controls.moves.setValue([...currentMoves, move]);
    }
  }

  protected deleteMove(index: number) {
    const moveControl = this.heatMapForm.controls.moves;
    const updated = [...moveControl.value.slice(0, index), ...moveControl.value.slice(index + 1)]
    this.heatMapForm.controls.moves.setValue(updated);
  }

  protected addPlayer() {
    const playerNode = this.selectedPlayerControl.value;
    const playerControl = this.heatMapForm.controls.playerNodes;

    if (playerNode && !playerControl.value.includes(playerNode)) {
      const currentNodes = playerControl.value;

      this.heatMapForm.controls.playerNodes.setValue([...currentNodes, playerNode]);
    }
  }

  protected deletePlayer(index: number) {
    const playerControl = this.heatMapForm.controls.playerNodes;
    const updated = [...playerControl.value.slice(0, index), ...playerControl.value.slice(index + 1)]
    this.heatMapForm.controls.playerNodes.setValue(updated);
  }

  private getHeatMap() {
    const config = this.heatMapForm.getRawValue() as HeatMapConfig;

    this.scotlandYardService.getHeatMap(config).subscribe(res => {
      this.heatMap.set(res);
    })
  }

  private getSession() {
    this.scotlandYardService.getSession().subscribe({
      next: res => {
        this.gameState.set(res);
      }
    });
  }


}
