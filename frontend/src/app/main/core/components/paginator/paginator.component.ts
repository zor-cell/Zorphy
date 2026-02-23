import {Component, input, model, output, signal} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Pageable} from "../../dto/Pageable";

@Component({
  selector: 'app-paginator',
  imports: [
    MatPaginator
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent {
  public pageSizeOptions = input<number[]>([10, 20, 50]);
  public pageable = model.required<Pageable>();
  public pageChanged = output<void>();

  protected onPageChange(event: PageEvent) {
    const pageable: Pageable = {
      page: event.pageIndex,
      size: event.pageSize,
      totalItems: this.pageable().totalItems
    };
    this.pageable.set(pageable);

    this.pageChanged.emit();
  }
}
