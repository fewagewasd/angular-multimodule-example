'use strict';

// test model class

function Test(data) {
    this.isTestObject = true;
    this.id = data.id;
    this.name = data.name;
}

Test.prototype.equals = function (data) {
    return data.id === this.id && data.name === this.name;
};

// actual spec
describe('Api Service', function () {

    var testData = [
        {id: 1, name: 'TestData1'},
        {id: 2, name: 'TestData2'}
    ];

    var $httpBackend;
    var $api;

    beforeEach(function () {

        angular.module('app.base.api.test', []).config(function ($apiProvider) {
            $apiProvider.endpoint('test', {
                url: 'test',
                model: Test
            });
        });

        module('app.base.api');
        module('app.base.api.test');

        inject(function (_$httpBackend_, _$api_) {
            $httpBackend = _$httpBackend_;
            $api = _$api_;
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return a paginated result if a PagedResultDTO is returned by the server', function () {
        $httpBackend.expectGET('/api/test?page=1&size=10').respond({totalCount: 2, elements: testData});
        $api.test.list({page: 2, size: 10}).then(function (result) {
            expect(result.totalCount).toBe(2);
            expect(result.elements.length).toBe(2);
            expect(result.elements[0].isTestObject).toBe(true);
            expect(result.elements[0].id).toBe(1);
            expect(result.elements[1].isTestObject).toBe(true);
            expect(result.elements[1].id).toBe(2);
        });
        $httpBackend.flush();
    });

    it('should return a list of objects if the server response is not paginated', function () {
        $httpBackend.expectGET('/api/test').respond(testData);
        $api.test.list().then(function (result) {
            expect(result.length).toBe(2);
            expect(result[0].isTestObject).toBe(true);
            expect(result[0].id).toBe(1);
            expect(result[1].isTestObject).toBe(true);
            expect(result[1].id).toBe(2);
        });
        $httpBackend.flush();
    });

    it('should post an object without id', function () {
        $httpBackend.expectPOST('/api/test', {name: 'NewTestObject'}).respond({id: 100, name: 'NewTestObject'});
        $api.test.save({name: 'NewTestObject'}).then(function (result) {
            expect(result.isTestObject).toBe(true);
            expect(result.id).toBe(100);
            expect(result.name).toBe('NewTestObject');
        });
        $httpBackend.flush();
    });

    it('should update an object with id', function () {
        $httpBackend.expectPUT('/api/test/100', {id: 100, name: 'NewTestObject'}).respond({id: 100, name: 'NewTestObject'});
        $api.test.save({id: 100, name: 'NewTestObject'}).then(function (result) {
            expect(result.isTestObject).toBe(true);
            expect(result.id).toBe(100);
            expect(result.name).toBe('NewTestObject');
        });
        $httpBackend.flush();
    });

    it('should delete an object', function () {
        $httpBackend.expectDELETE('/api/test/100').respond(200);
        $api.test.remove(100).then(function (response) {
            expect(response.status).toBe(200);
        });
        $httpBackend.flush();
    });
});