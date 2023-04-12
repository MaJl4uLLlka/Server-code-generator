import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent, tap } from 'rxjs';
import { RepositoryService } from '../../../services/repository-service.service';

@Component({
  selector: 'app-user-repositories',
  templateUrl: './user-repositories.component.html',
  styleUrls: ['./user-repositories.component.css']
})
export class UserRepositoriesComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'type'];
  dataSource: any[]
  repositoriesCount: number = 0;

  constructor(private repositoryService: RepositoryService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadRepositoriesPage();

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRepositoriesPage();
        })
      )
      .subscribe();

    this.paginator.page
      .pipe(
        tap(() => this.loadRepositoriesPage())
      )
      .subscribe();
  }

  loadRepositoriesPage() {
    this.repositoryService.findUserRepositories(
      this.input.nativeElement.value,
      this.paginator.pageIndex,
      this.paginator.pageSize,).pipe(
  )
  .subscribe( data => { this.dataSource = data.items; this.repositoriesCount = data.count })
  }
}
