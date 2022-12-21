import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Repository } from '../../../dto/repository';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, catchError, debounceTime, finalize, fromEvent, Observable, of, tap } from 'rxjs';
import { RepositoryService } from '../../../services/repository-service.service';

@Component({
  selector: 'app-user-repositories',
  templateUrl: './user-repositories.component.html',
  styleUrls: ['./user-repositories.component.css']
})
export class UserRepositoriesComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'type'];
  dataSource: UserRepositoriesDataSource;

  constructor(private repositoryService: RepositoryService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  ngOnInit(): void {
    this.dataSource = new UserRepositoriesDataSource(this.repositoryService);
    this.dataSource.loadRepositoriesCount();
    this.dataSource.loadRepositories();
  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRepositoriesCount();
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
    this.dataSource.loadRepositories(
      this.input.nativeElement.value,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }

  loadRepositoriesCount() {
    this.dataSource.loadRepositoriesCount(this.input.nativeElement.value);
  }
}

class UserRepositoriesDataSource implements DataSource<Repository> {
  private repositoriesSubject = new BehaviorSubject<Repository[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countRepositoriesSubject = new BehaviorSubject<number>(0);
  public countRepositories = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor(private repositoryService: RepositoryService) {}

  connect(collectionViewer: CollectionViewer): Observable<Repository[]> {
      return this.repositoriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.repositoriesSubject.complete();
      this.loadingSubject.complete();
      this.countRepositoriesSubject.complete();
  }

  loadRepositories(filter = '', page = 0, pageSize = 5) {

      this.loadingSubject.next(true);

      this.repositoryService.findUserRepositories(filter, page, pageSize).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(repositories => this.repositoriesSubject.next(repositories));
  }
  
  loadRepositoriesCount(filter = '') {
    this.repositoryService.getCountOfUserRepositories(filter)
      .subscribe(count => {
        this.countRepositoriesSubject.next(count);
        this.countRepositories = this.countRepositoriesSubject.value;
      });    
  }
}
