import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import all Material modules you intend to use globally
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridList, MatGridTile, MatGridTileFooterCssMatStyler } from '@angular/material/grid-list';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatGridList,
    MatGridTile,
    MatGridTileFooterCssMatStyler
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatGridList,
    MatGridTile,
    MatGridTileFooterCssMatStyler
  ]
})
export class MaterialModule { }