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

  public ngOnInit(): void {
    this.genres = this.data.genres || [];
    this.directors = this.data.directors || [];
    this.movie = this.data.movie || {};
  }

  public closeMessageBox(): void {
    this.dialogRef.close();
  }
}