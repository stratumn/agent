/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { Ng2MapExplorerModule } from "../../src/ng2-map-explorer.module";
import {
  MatButtonModule,
  MatTabsModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
} from "@angular/material";

describe("App: Angular2Mapexplorer", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FormsModule,
        Ng2MapExplorerModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
      ],
    });
  });

  it(
    "should create the app",
    async(() => {
      let fixture = TestBed.createComponent(AppComponent);
      let app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }),
  );
});
