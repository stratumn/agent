import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdButtonModule } from '@angular2-material/button';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdIconModule } from '@angular2-material/icon';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdToolbarModule } from '@angular2-material/toolbar';

import { AppComponent } from './app.component';
import { MapExplorerModule } from '../../src/map-explorer.module';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdTabsModule,
    MdIconModule,
    MdProgressCircleModule,
    MdToolbarModule,
    MapExplorerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
