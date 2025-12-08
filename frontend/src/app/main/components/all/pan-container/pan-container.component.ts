import {Component, ElementRef, inject, input, Input} from '@angular/core';
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
    public centerPosition = input<Position>({
        x: 0,
        y: 0
    })

    private isPanning = false;
    private panOffset: Position = {
        x: 0,
        y: 0
    };
    private lastMousePosition: Position = {
        x: 0,
        y: 0
    };

    private minZoom: number = 0.3;
    private maxZoom: number = 2;
    private zoomScale: number = 1;
    private initialPinchDistance: number | null = null;

    private rotation: number = 0;

    get transformStyle() {
        return {
            transform: `translate(${this.centerPosition().x + this.panOffset.x}px, ${this.centerPosition().y + this.panOffset.y}px)
        scale(${this.zoomScale})
        rotate(${this.rotation}deg)`,
            transformOrigin: `0 0`
        };
    }

    protected resetOffset() {
        this.panOffset = {
            x: 0,
            y: 0
        };
        this.zoomScale = 1;
        this.rotation = 0;
    }

    protected rotate() {
        this.rotation = (this.rotation + 90) % 360;
    }

    protected startPan(event: MouseEvent | TouchEvent) {
        this.isPanning = true;

        this.lastMousePosition = this.getEventPos(event);
    }

    protected touchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.startPan(event);
        } else if (event.touches.length === 2) {
            this.initialPinchDistance = this.getPinchDistance(event);
            event.preventDefault();
        }
    }

    protected touchMove(event: TouchEvent) {
        if(event.touches.length === 1) {
            this.pan(event);
        } else if(event.touches.length === 2) {
            this.pinch(event);
        }
    }

    protected pan(event: MouseEvent | TouchEvent) {
        if (!this.isPanning || !this.canPan()) return;
        event.preventDefault();

        const eventPos: Position = this.getEventPos(event);

        const dx = eventPos.x - this.lastMousePosition.x;
        const dy = eventPos.y - this.lastMousePosition.y;

        this.panOffset.x += dx;
        this.panOffset.y += dy;
        this.lastMousePosition = {
            x: eventPos.x,
            y: eventPos.y
        };
    }

    protected endPan() {
        this.isPanning = false;
    }

    protected scroll(event: WheelEvent) {
        if (!this.canZoom()) return;
        event.preventDefault();

        const delta = -event.deltaY;
        const zoomFactor = delta > 0 ? 1.1 : 0.9;
        const newScale = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomScale * zoomFactor));

        if (newScale === this.zoomScale) return;

        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const currentTranslateX = this.centerPosition().x + this.panOffset.x;
        const currentTranslateY = this.centerPosition().y + this.panOffset.y;

        const worldX = (mouseX - currentTranslateX) / this.zoomScale;
        const worldY = (mouseY - currentTranslateY) / this.zoomScale;

        this.zoomScale = newScale;

        const newTranslateX = mouseX - (worldX * newScale);
        const newTranslateY = mouseY - (worldY * newScale);

        this.panOffset.x = newTranslateX - this.centerPosition().x;
        this.panOffset.y = newTranslateY - this.centerPosition().y;
    }

    protected pinch(event: TouchEvent) {
        if (!this.canZoom() || event.touches.length !== 2) return;
        event.preventDefault();

        const currentDistance = this.getPinchDistance(event);
        if (this.initialPinchDistance) {
            const scaleChange = currentDistance / this.initialPinchDistance;
            const newZoom = this.zoomScale * scaleChange;

            this.zoomScale = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
            this.initialPinchDistance = currentDistance; // Update for next frame
        }
    }

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
}
