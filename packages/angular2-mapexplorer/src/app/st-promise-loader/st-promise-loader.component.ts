import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'st-promise-loader',
  templateUrl: './st-promise-loader.component.html',
  styleUrls: ['./st-promise-loader.component.css']
})
export class StPromiseLoaderComponent implements OnInit, OnChanges {

  @Input() title: string;

  @Input() loading: boolean;

  @Input() errors: Array<String>;

  errorMessages = [];

  loadingErrors = false;

  success = false;

  error = false;

  errorsShowed = false;

  toggleErrors = () => {
    this.errorsShowed = !this.errorsShowed;
  };

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {    
    this.errorMessages = [];
    this.success = false;
    this.error = false;
    if (this.errors) {
      this.loadingErrors = true;
      Promise.all(this.errors)
        .then(errs => {
          this.errorMessages = errs.filter(Boolean);
          this.loadingErrors = false;
          this.success = this.errorMessages.length === 0;
          this.error = !this.success;
        })
        .catch(err => {
          console.log(err);
          this.loadingErrors = false;
        });
    }
  }
}
