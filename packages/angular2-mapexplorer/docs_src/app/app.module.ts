import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import {
  MatButtonModule,
  MatTabsModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
} from "@angular/material";

import { AppComponent } from "./app.component";
import { Ng2MapExplorerModule } from "../../src/ng2-map-explorer.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    Ng2MapExplorerModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
