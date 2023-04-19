import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../services/repository-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  id: string;
  isUserOwner: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService,
    public dialog: MatDialog
  ){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.repositoryService.isUserRepositoryOwner(this.id)
      .subscribe(
        data => { this.isUserOwner = data.isUserOwner }
      );
  }

  openDeleteRepositoryDialog(){
    const dialogRef = this.dialog.open(DeleteRepositoryDialog, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(needToDelete => {
      if(!needToDelete) {
        return;
      }

      this.repositoryService.deleteRepository(this.id)
        .subscribe(
          data => {
            this.router.navigate(['repositories']);
          }
        )
      });
  }
}


@Component({
  selector: 'delete-repository-dialog',
  templateUrl: './delete-repository-dialog.html',
})
export class DeleteRepositoryDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteRepositoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}