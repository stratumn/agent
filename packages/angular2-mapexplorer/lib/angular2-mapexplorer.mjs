import { Component, Injectable, Input, NgModule, Pipe, ViewChild } from '@angular/core';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { ChainTreeBuilder, ChainValidator, MerklePathTree } from 'mapexplorer-core';

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var StMapExplorerComponent = (function () {
    function StMapExplorerComponent(chainTreeBuilderService) {
        this.chainTreeBuilderService = chainTreeBuilderService;
        this.tags = [];
        var self = this;
        this.defaultOptions = {
            onclick: function (d, onHide) {
                self.show(d.data, onHide);
            },
            onTag: function (tag) {
                if (tag) {
                    self.tags = Array.from(new Set(self.tags.concat(tag)));
                }
            }
        };
    }
    StMapExplorerComponent.prototype.ngOnInit = function () {
    };
    StMapExplorerComponent.prototype.ngOnChanges = function () {
        var _this = this;
        // const options = { ...defaultOptions, ...scope.options };
        if (this.builder) {
            this.error = null;
            this.loading = true;
            this.chainTreeBuilderService.build(this.builder, this, this.defaultOptions)
                .then(function () { return (_this.loading = false); })
                .catch(function (error) {
                _this.loading = false;
                _this.error = error.message;
            });
        }
    };
    StMapExplorerComponent.prototype.ngAfterViewInit = function () {
        this.builder = this.chainTreeBuilderService.getBuilder(this.map.nativeElement);
    };
    StMapExplorerComponent.prototype.transactionUrl = function (segment) {
        return segment.meta.evidence.transactions['bitcoin:main'];
    };
    StMapExplorerComponent.prototype.show = function (segment, onHide) {
        this.segment = segment;
        this.onHide = onHide;
        this.onSegmentShow(this.name);
    };
    StMapExplorerComponent.prototype.close = function () {
        this.segment = null;
        this.onSegmentHide(this.name);
        this.onHide();
    };
    StMapExplorerComponent.prototype.display = function (tab) {
        this.displayed = tab;
        // this.editors.forEach(editor => {
        //   editor.resize();
        //   editor.renderer.updateFull();
        // });
    };
    StMapExplorerComponent.prototype.state = function () {
        return JSON.stringify(this.segment.link.state, undefined, 2);
    };
    StMapExplorerComponent.prototype.segmentJSON = function () {
        return JSON.stringify(this.segment, undefined, 2);
    };
    __decorate([
        ViewChild('map')
    ], StMapExplorerComponent.prototype, "map");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "chainscript");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "refresh");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "name");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "application");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "mapId");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "onSegmentShow");
    __decorate([
        Input()
    ], StMapExplorerComponent.prototype, "onSegmentHide");
    StMapExplorerComponent = __decorate([
        Component({
            selector: 'st-map-explorer',
            templateUrl: './st-map-explorer.component.html',
            styleUrls: ['./st-map-explorer.component.css']
        })
    ], StMapExplorerComponent);
    return StMapExplorerComponent;
}());

var FunctionArgumentsPipe = (function () {
    function FunctionArgumentsPipe() {
    }
    FunctionArgumentsPipe.prototype.transform = function (value, args) {
        return value.map(function (arg) {
            if (arg instanceof Object) {
                return JSON.stringify(arg, undefined, 2);
            }
            return arg;
        }).join(', ');
    };
    FunctionArgumentsPipe = __decorate([
        Pipe({
            name: 'functionArguments'
        })
    ], FunctionArgumentsPipe);
    return FunctionArgumentsPipe;
}());

var ChainTreeBuilderService = (function () {
    function ChainTreeBuilderService() {
    }
    ChainTreeBuilderService.prototype.getBuilder = function (element) {
        return new ChainTreeBuilder(element);
    };
    ChainTreeBuilderService.prototype.build = function (builder, map, options) {
        return builder.build({
            id: map.mapId,
            application: map.application,
            chainscript: map.chainscript
        }, options);
    };
    ChainTreeBuilderService = __decorate([
        Injectable()
    ], ChainTreeBuilderService);
    return ChainTreeBuilderService;
}());

var MapValidatorService = (function () {
    function MapValidatorService() {
    }
    MapValidatorService.prototype.validate = function (chainscript) {
        return new ChainValidator(chainscript).validate();
    };
    MapValidatorService = __decorate([
        Injectable()
    ], MapValidatorService);
    return MapValidatorService;
}());

var StMapValidatorComponent = (function () {
    function StMapValidatorComponent(mapValidatorService) {
        this.mapValidatorService = mapValidatorService;
        this.errors = {};
        this.error = null;
        this.loading = false;
    }
    StMapValidatorComponent.prototype.ngOnInit = function () {
    };
    StMapValidatorComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.error = null;
        if (this.chainscript) {
            this.loading = true;
            this.mapValidatorService.validate(this.chainscript)
                .then(function (errors) {
                _this.errors = errors;
                _this.loading = false;
            }).catch(function (error) {
                _this.error = error.message;
                _this.loading = false;
            });
        }
    };
    __decorate([
        Input()
    ], StMapValidatorComponent.prototype, "chainscript");
    StMapValidatorComponent = __decorate([
        Component({
            selector: 'st-map-validator',
            templateUrl: './st-map-validator.component.html',
            styleUrls: ['./st-map-validator.component.css']
        })
    ], StMapValidatorComponent);
    return StMapValidatorComponent;
}());

var StPromiseLoaderComponent = (function () {
    function StPromiseLoaderComponent() {
        var _this = this;
        this.errorMessages = [];
        this.loadingErrors = false;
        this.success = false;
        this.error = false;
        this.errorsShowed = false;
        this.toggleErrors = function () {
            _this.errorsShowed = !_this.errorsShowed;
        };
    }
    StPromiseLoaderComponent.prototype.ngOnInit = function () {
    };
    StPromiseLoaderComponent.prototype.ngOnChanges = function () {
        var _this = this;
        this.errorMessages = [];
        this.success = false;
        this.error = false;
        if (this.errors) {
            this.loadingErrors = true;
            Promise.all(this.errors)
                .then(function (errs) {
                _this.errorMessages = errs.filter(Boolean);
                _this.loadingErrors = false;
                _this.success = _this.errorMessages.length === 0;
                _this.error = !_this.success;
            })
                .catch(function (err) {
                console.log(err);
                _this.loadingErrors = false;
            });
        }
    };
    __decorate([
        Input()
    ], StPromiseLoaderComponent.prototype, "title");
    __decorate([
        Input()
    ], StPromiseLoaderComponent.prototype, "loading");
    __decorate([
        Input()
    ], StPromiseLoaderComponent.prototype, "errors");
    StPromiseLoaderComponent = __decorate([
        Component({
            selector: 'st-promise-loader',
            templateUrl: './st-promise-loader.component.html',
            styleUrls: ['./st-promise-loader.component.css']
        })
    ], StPromiseLoaderComponent);
    return StPromiseLoaderComponent;
}());

var StMerklePathTreeComponent = (function () {
    function StMerklePathTreeComponent(element) {
        this.element = element;
        this.merklePathTree = null;
    }
    StMerklePathTreeComponent.prototype.ngOnInit = function () {
    };
    StMerklePathTreeComponent.prototype.ngOnChanges = function () {
        this.merklePathTree = this.merklePathTree || new MerklePathTree(this.element.nativeElement);
        this.merklePathTree.display(this.merklePath);
    };
    __decorate([
        Input()
    ], StMerklePathTreeComponent.prototype, "merklePath");
    StMerklePathTreeComponent = __decorate([
        Component({
            selector: 'st-merkle-path-tree',
            template: '<div class="merkle-path"></div>',
            styleUrls: ['./st-merkle-path-tree.component.css']
        })
    ], StMerklePathTreeComponent);
    return StMerklePathTreeComponent;
}());

var MapExplorerModule = (function () {
    function MapExplorerModule() {
    }
    MapExplorerModule = __decorate([
        NgModule({
            declarations: [
                StMapExplorerComponent,
                FunctionArgumentsPipe,
                StMapValidatorComponent,
                StPromiseLoaderComponent,
                StMerklePathTreeComponent
            ],
            imports: [
                MdButtonModule,
                MdIconModule,
                MdProgressCircleModule,
                MdToolbarModule
            ],
            providers: [
                ChainTreeBuilderService,
                MapValidatorService
            ],
            bootstrap: []
        })
    ], MapExplorerModule);
    return MapExplorerModule;
}());

export { MapExplorerModule };
//# sourceMappingURL=angular2-mapexplorer.mjs.map
