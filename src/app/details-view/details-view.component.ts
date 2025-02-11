import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatCardModule,
} from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-details-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './details-view.component.html',
  styleUrl: './details-view.component.scss',
})

export class DetailsViewComponent implements OnInit {
  public genres: {name:string, description:string} = {name:'', description:''};
  public directors: {name:string, birthYear:string} = {name:'', birthYear:''};
  public movie: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetailsViewComponent>
  ) {}

  /**
   * OnInit lifecycle hook. Initialize the component's data from the provided input data.
   * If the data is not provided, set the component's data to default values.
   */
  public ngOnInit(): void {
    this.genres = this.data.genres || [];
    this.directors = this.data.directors || [];
    this.movie = this.data.movie || {};
  }

  /**
   * Close the details view dialog box.
   * This method is called from the component's template.
   * When called, it will close the dialog box and cause the component to be destroyed.
   */
  public closeMessageBox(): void {
    this.dialogRef.close();
  }
}