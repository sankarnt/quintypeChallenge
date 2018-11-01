
    
app.controller("mineSweepController", function($scope){
    $scope.createBlockObj = function() {   
        var diamondCount = 1;
        $scope.squares= [];
        $scope.hasDiamondsArr = [];
        for (var index = 0; index < 64; index++) {
            var randonIndex = $scope.getRandomObj();
            var tempObj = {
                "index": index, 
                "hasDiamond": false, 
                "isRevealed": false
            }
            $scope.squares.push(tempObj);
            
            if($scope.squares[randonIndex] && diamondCount < 9) {
                $scope.squares[randonIndex].hasDiamond = true;
                $scope.hasDiamondsArr.push(randonIndex);
                diamondCount++;
            }

        }
        $scope.hasDiamondsArr.sort(function(a, b){return a - b});
        console.log($scope.hasDiamondsArr);      
    }
    $scope.getRandomObj = function() {
        var min = 0; 
        var max = 64;
        return parseInt(Math.random() * (+max - +min) + +min); 
    }

    $scope.revealPuzzle = function(box, elt){
        if(!!box && !!box.hasDiamond) {
            elt.target.classList.add("mine-box-diamond-bg");
            box.isRevealed = true;
            // localStorage.setItem("game", JSON.stringify($scope.squares));
        } else {
            // elt.target.classList.add("mine-box-clue-bg");
            
        }
    }
    
    if(localStorage.getItem("game")) {
        $scope.squares = JSON.parse(localStorage.getItem("game"));
    } else {
        $scope.createBlockObj();
    }

})