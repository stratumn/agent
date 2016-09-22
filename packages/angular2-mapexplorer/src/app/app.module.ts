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
import { StMapExplorerComponent } from './st-map-explorer/st-map-explorer.component';
import { FunctionArgumentsPipe } from './function-arguments.pipe';
import { ChainTreeBuilderService } from './chain-tree-builder.service';
import { MapValidatorService } from './map-validator.service';
import { StMapValidatorComponent } from './st-map-validator/st-map-validator.component';
import { StPromiseLoaderComponent } from './st-promise-loader/st-promise-loader.component';
import { StMerklePathTreeComponent } from './st-merkle-path-tree/st-merkle-path-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    StMapExplorerComponent,
    FunctionArgumentsPipe,
    StMapValidatorComponent,
    StPromiseLoaderComponent,
    StMerklePathTreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdTabsModule,
    MdIconModule,
    MdProgressCircleModule,
    MdToolbarModule
  ],
  providers: [
    ChainTreeBuilderService,
    MapValidatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
