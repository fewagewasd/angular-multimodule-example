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

    var testData = {
        _embedded: {
            test: [
                {id: 1, name: 'TestData1'},
                {id: 2, name: 'TestData2'}
            ]
        }
    };

    var $httpBackend;
    var $api;

    beforeEach(function () {

        angular.module('multimodule.example.base.api.test', []).config(function ($apiProvider) {
            $apiProvider.endpoint('test', {
                url: 'test',
                model: Test
            });
        });

        module('multimodule.example.base.api');
        module('multimodule.example.base.api.test');

        inject(function (_$httpBackend_, _$api_) {
            $httpBackend = _$httpBackend_;
            $api = _$api_;
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return a list of objects if the server response is not paginated', function () {
        $httpBackend.expectGET('/api/test').respond(testData);
        $api.test.list().then(function (result) {
            expect(result._embedded.test.length).toBe(2);
            expect(result._embedded.test[0].isTestObject).toBe(true);
            expect(result._embedded.test[0].id).toBe(1);
            expect(result._embedded.test[1].isTestObject).toBe(true);
            expect(result._embedded.test[1].id).toBe(2);
        });
        $httpBackend.flush();
    });

    it('should post an object without id', function () {
        $httpBackend.expectPOST('/api/test', {name: 'NewTestObject'}).respond(200);
        $api.test.save({name: 'NewTestObject'}).then(function (response) {
            expect(response.status).toBe(200);
        });
        $httpBackend.flush();
    });

    it('should update an object with id', function () {
        $httpBackend.expectPUT('/api/test/100', {id: 100, name: 'NewTestObject'}).respond(200);
        $api.test.save({id: 100, name: 'NewTestObject'}).then(function (response) {
            expect(response.status).toBe(200);
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