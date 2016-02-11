var weather = angular.module('weather', [])
.controller('WeatherController', ['$http', '$scope', function($http, $scope) {

  var _this = this;
  this.raw = null;
  this.counties = [];

  $http.get('data.json').success(function(data) {

    _this.raw = data;
    _this.counties = _this.raw.file_data.curr_custs_aff.areas[0].areas;

  });

  this.outage_percent = function(county) {
    return Math.round((county.custs_out / county.total_custs) * 100) + "%";
  };

  this.state = function(county) {
    return county.area_name.substr(0, 2);
  }

  this.area = function(county) {
    return county.area_name.substr(3);
  }

}]);
