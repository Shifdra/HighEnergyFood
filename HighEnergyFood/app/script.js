angular.module('app', ['ngResource'])

.value('nutritionixConst', {
    'appId': '93744af0',
    'appKey': '16372bcb6bcfc0501fcb6739f5142e5b'
})

.controller('mainCtrl', function ($scope, DataService, DataServiceHTTP) {
    $scope.data = { searchKey: '' };

    $scope.getItemHeight = function (item, index) {
        //Make evenly indexed items be 10px taller, for the sake of example
        return 80;
    };

    $scope.doSearch = function () {
        console.debug("Searching for: " + $scope.data.searchKey);

        if (true) {
            // use the $resource based service
            var promise = DataService.getAll({
                'term': $scope.data.searchKey,
                'results': '0:20',      // <-- variable substitution
                //'fields':'item_name'    <-- you can specify field params
            }).$promise;
            promise.then(function (_response) {
                console.debug(" The data " + JSON.stringify(_response));
                $scope.items = _response.hits;
            });

        } else {
            // use the $http based service
            var promise = DataServiceHTTP.getAll($scope.data.searchKey);
            promise.then(function (_response) {
                console.debug(" The data " + JSON.stringify(_response.data));
                $scope.items = _response.data.hits;
            });
        }
    };
})

.factory('DataService', function ($resource, nutritionixConst) {
    var aSearchObject = $resource('https://api.nutritionix.com/v1_1/search/:term', { term: '@term' }, {
        getAll: {
            method: 'get',
            //isArray : true,
            params: {
                results: ':results',
                appId: nutritionixConst.appId,
                appKey: nutritionixConst.appKey,
                // brand_id:'513fbc1283aa2dc80c00001f',
                fields: ':fields',
                filters: {
                    not: {
                        item_type: 1
                    }
                }
            }
        }
    });
    return {
        /**
        * we can specify the params, the query string and the default fields
        * to turn in the query along with the result size
        */
        getAll: function (_params) {
            var defaultFields = '*';

            if (!_params.fields) {
                _params.fields = defaultFields;
            }
            return aSearchObject.getAll(_params);
        }
    }

})

.factory('DataServiceHTTP', function ($http, nutritionixConst) {
    return {
        getAll: function (_key) {
            return $http.get('https://api.nutritionix.com/v1_1/search/' + _key, {
                'params': {
                    results: '0:20',
                    appId: nutritionixConst.appId,
                    appKey: nutritionixConst.appKey,
                    fields: '*',
                    filters: {
                        not: {
                            item_type: 1
                        }
                    }
                }
            });
        }
    }
});