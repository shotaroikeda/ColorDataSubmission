var app = angular.module('colorDataApp', ['ngRoute', 'ui.bootstrap.buttons']);
console.log("test");

var gen_color = function()
{
    var lookup = "0123456789ABCDEF".split("");
    var col = "#";

    for(var i = 0; i < 6; i++)
    {
        col += lookup[Math.floor(Math.random()*lookup.length)]
    }
    return col;
}

var gen_color_arr = function ()
{
    var arr = [];

    for (var i = 0; i < 6; i++)
    {
        arr.push(gen_color());
    }

    return arr;
}

var write_to_good = function(comp_array)
{
    var dataRef = new Firebase("https://colordatasubmission.firebaseio.com/good");
    dataRef.push({
        hex: comp_array[0],
        color: comp_array[1]
    });
}

var write_to_bad = function(comp_array)
{
    var dataRef = new Firebase("https://colordatasubmission.firebaseio.com/bad");
    dataRef.push({
        hex: comp_array[0],
        color: comp_array[1]
    });
}

app.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                    when('/', {
                        templateUrl: 'index.html',
                        controller: 'formCtrl'
                    }).
		    when('/end', {
			templateUrl: 'end.html',
			controller: 'endFormCtrl'
		    }).
                    otherwise({
                        redirectTo: '/'
                    });
            }
           ]);

app.controller('formCtrl', ['$scope', function($scope)
                            {
                                $scope.q_colors = gen_color_arr();

				var q_result_arr = [
				    [$scope.q_colors[0], null],
				    [$scope.q_colors[1], null],
				    [$scope.q_colors[2], null],
				    [$scope.q_colors[3], null],
				    [$scope.q_colors[4], null],
				    [$scope.q_colors[5], null],
				];

                                // Drop down menu
                                $scope.default_item = "Pick an option below...";
				
				$scope.log_obj = function($index, radioModel)
				{
				    q_result_arr[$index][1] = radioModel;
				}
                                // onClick event handler for submit
				$scope.submit_and_check = function()
				{
				    for (var i = 0; i < q_result_arr.length; i++)
				    {
					if (q_result_arr[i][1] == null)
					{
					    alert("You have not filled out Q." + (i+1));
					    return;
					}
				    }

				    for (var i = 0; i < q_result_arr.length/2; i++)
				    {
					write_to_bad(q_result_arr[i+3]);
					write_to_good(q_result_arr[i]);
				    }
				    window.location.replace("end");
				}

                            }]);

app.controller('endFormCtrl', ['$scope', function($scope){
}]);
