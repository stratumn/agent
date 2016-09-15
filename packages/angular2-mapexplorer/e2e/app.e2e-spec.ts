import { Angular2MapexplorerPage } from './app.po';

describe('angular2-mapexplorer App', function() {
  let page: Angular2MapexplorerPage;

  beforeEach(() => {
    page = new Angular2MapexplorerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
