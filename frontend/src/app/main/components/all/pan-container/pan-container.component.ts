import {Component, computed, ElementRef, inject, input, signal} from '@angular/core';
import {NgStyle} from "@angular/common";
import {Position} from "../../../dto/all/Position";

@Component({
    selector: 'app-pan-container',
    imports: [
        NgStyle
    ],
    templateUrl: './pan-container.component.html',
    standalone: true,
    styleUrl: './pan-container.component.css'
})
export class PanContainerComponent {
    public elementRef = inject(ElementRef);

    public canPan = input<boolean>(true);
    public canZoom = input<boolean>(true);
    public canRotate = input<boolean>(true);
    public centerPosition = input<Position>({x: 0, y: 0})

    private panOffset = signal<Position>({x: 0, y: 0});
    private zoomScale = signal<number>(1);
    private rotation = signal<number>(0);

    private isPanning = false;
    private lastMousePosition: Position = {x: 0, y: 0};
    private initialPinchDistance: number | null = null;
    private minZoom: number = 0.3;
    private maxZoom: number = 2;

    protected transformStyle = computed(() => {
        const off = this.panOffset();
        const center = this.centerPosition();

        const x = center.x + off.x;
        const y = center.y + off.y;

        return {
            transform: `translate(${x}px, ${y}px) scale(${this.zoomScale()}) rotate(${this.rotation()}deg)`,
            transformOrigin: `0 0`
        };
    })

    protected reset() {
        this.panOffset.set({
            x: 0,
            y: 0
        });
        this.zoomScale.set(1);
        this.rotation.set(0);
    }

    protected rotate() {
        if(!this.canRotate()) return;

        this.rotation.update(currentRotation => (currentRotation + 90) % 360);
    }

    // pan logic
    protected startPan(event: MouseEvent | TouchEvent) {
        this.isPanning = true;
        this.lastMousePosition = this.getEventPos(event);
    }

    protected endPan() {
        this.isPanning = false;
    }

    protected pan(event: MouseEvent | TouchEvent) {
        if (!this.isPanning || !this.canPan()) return;
        event.preventDefault();

        const eventPos: Position = this.getEventPos(event);

        const dx = eventPos.x - this.lastMousePosition.x;
        const dy = eventPos.y - this.lastMousePosition.y;

        this.panOffset.update(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }))
        this.lastMousePosition = eventPos;
    }

    // zoom logic
    private applyZoomAtPosition(newScaleRaw: number, screenX: number, screenY: number) {
        const currentScale = this.zoomScale();
        const newScale = Math.min(this.maxZoom, Math.max(this.minZoom, newScaleRaw));

        if (newScale === currentScale) return;

        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        // calculate mouse position relative to container
        const relativeX = screenX - rect.left;
        const relativeY = screenY - rect.top;

        // current total translation
        const currentTotalX = this.centerPosition().x + this.panOffset().x;
        const currentTotalY = this.centerPosition().y + this.panOffset().y;

        // calculate world point under the cursor
        const worldX = (relativeX - currentTotalX) / currentScale;
        const worldY = (relativeY - currentTotalY) / currentScale;

        this.zoomScale.set(newScale);

        // calculate new translation to keep world point under cursor
        const newTotalX = relativeX - (worldX * newScale);
        const newTotalY = relativeY - (worldY * newScale);

        // update pan offset
        this.panOffset.set({
            x: newTotalX - this.centerPosition().x,
            y: newTotalY - this.centerPosition().y
        });
    }

    protected scroll(event: WheelEvent) {
        if (!this.canZoom()) return;
        event.preventDefault();

        const delta = -event.deltaY;
        const zoomFactor = delta > 0 ? 1.1 : 0.9;
        const targetScale = this.zoomScale() * zoomFactor;

        this.applyZoomAtPosition(targetScale, event.clientX, event.clientY);
    }

    protected touchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.startPan(event);
        } else if (event.touches.length === 2) {
            this.initialPinchDistance = this.getPinchDistance(event);
            this.lastMousePosition = this.getMidpoint(event);
            event.preventDefault();
        }
    }

    protected touchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.pan(event);
        } else if (event.touches.length === 2) {
            this.pinch(event);
        }
    }

    protected pinch(event: TouchEvent) {
        if (!this.canZoom() || event.touches.length !== 2 || !this.initialPinchDistance) return;
        event.preventDefault();

        const currentDistance = this.getPinchDistance(event);
        const scaleChange = currentDistance / this.initialPinchDistance;
        const targetScale = this.zoomScale() * scaleChange;

        // Get the center point between fingers
        const midpoint = this.getMidpoint(event);

        this.applyZoomAtPosition(targetScale, midpoint.x, midpoint.y);

        this.initialPinchDistance = currentDistance;
    }

    // helper methods
    private getEventPos(event: MouseEvent | TouchEvent): Position {
        if (event instanceof MouseEvent) {
            return {
                x: event.clientX,
                y: event.clientY
            }
        } else {
            const touch = event.touches[0];
            return {
                x: touch.clientX,
                y: touch.clientY
            }
        }
    }

    private getPinchDistance(event: TouchEvent): number {
        const [touch1, touch2] = [event.touches[0], event.touches[1]];
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private getMidpoint(event: TouchEvent): Position {
        const t1 = event.touches[0];
        const t2 = event.touches[1];
        return {
            x: (t1.clientX + t2.clientX) / 2,
            y: (t1.clientY + t2.clientY) / 2
        };
    }
}
