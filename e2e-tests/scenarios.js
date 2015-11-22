'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /mapView when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/mapView");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/mapView');
    });


    it('should render mapView when user navigates to /mapView', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('listView', function() {

    beforeEach(function() {
      browser.get('index.html#/listView');
    });


    it('should render listView when user navigates to /listView', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
