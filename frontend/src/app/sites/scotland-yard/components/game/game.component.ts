import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {ScotlandYardService} from "../../services/scotland-yard.service";
import {GameState} from "../../dto/game/GameState";
import {MainHeaderComponent} from "../../../../main/components/all/main-header/main-header.component";
import {NgStyle} from "@angular/common";
import {PanContainerComponent} from "../../../../main/components/all/pan-container/pan-container.component";
import {Position} from "../../../../main/dto/all/Position";
import {GraphNode} from "../../dto/GraphNode";
import {EdgeType} from "../../dto/EdgeType";

@Component({
  selector: 'scotland-yard-game',
  imports: [
    MainHeaderComponent,
    PanContainerComponent,
    NgStyle
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class ScotlandYardGameComponent implements OnInit{
  protected scotlandYardService = inject(ScotlandYardService);

  private map = viewChild.required<PanContainerComponent>('map');
  protected gameState = signal<GameState | null>(null);

  private nodeSize = 30;

  protected maxSize = computed((): Position => {
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

  protected getNodePositionStyle(position: Position) {
    return {
      left: `${position.x - this.nodeSize / 2}px`,
      top: `${position.y - this.nodeSize / 2}px`,
      width: `${this.nodeSize}px`,
      height: `${this.nodeSize}px`
    }
  }

  protected temp(entry: GraphNode) {
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

  private getSession() {
    this.scotlandYardService.getSession().subscribe({
      next: res => {
        this.gameState.set(res);
      }
    });
  }
}
