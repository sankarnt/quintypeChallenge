
    
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
    }
    $scope.getRandomObj = function() {
        var min = 0; 
        var max = 64;
        var randomInd = parseInt(Math.random() * (+max - +min) + +min); 
        if($scope.hasDiamondsArr.indexOf(randomInd) > -1){
            $scope.getRandomObj();
        } else{
            return randomInd;
        }
    }

    $scope.revealPuzzle = function(box, elt){
        if(!!box && !!box.hasDiamond) {
            var indexToRemove = $scope.hasDiamondsArr.indexOf(box.index)
            if(indexToRemove > -1) {
                $scope.hasDiamondsArr.splice(indexToRemove, 1);
                elt.target.classList.add("mine-box-diamond-bg");
                box.isRevealed = true;
            }
            localStorage.setItem("game", JSON.stringify($scope.squares));
            localStorage.setItem("diamond", JSON.stringify($scope.hasDiamondsArr));

            if($scope.hasDiamondsArr.length === 0) {
                alert("Yooooo!!! You Won!!!!");
                localStorage.removeItem("game");
                localStorage.removeItem("diamond");
            }
        } else {
            $scope.getClueDirection(box, elt);
        }
    }

    
    $scope.prevClickedElt = null;
    
    $scope.getClueDirection = function(box, elt) {
        var bIndex = box.index;
        var minDifference;
        var choosenIndex;
        
        if($scope.prevClickedElt) {
            $scope.prevClickedElt.classList.remove("mine-box-clue-bg-left");
            $scope.prevClickedElt.classList.remove("mine-box-clue-bg-right");
        }
        $scope.prevClickedElt = elt.target;
        for (var i = 0; i < $scope.hasDiamondsArr.length; i++) {
            var tempDifference = bIndex - $scope.hasDiamondsArr[i];
            if(typeof(minDifference) === "undefined"){
                minDifference = Math.abs(tempDifference);
                choosenIndex = $scope.hasDiamondsArr[i];
            } else if(Math.abs(tempDifference) < minDifference){
                minDifference = Math.abs(tempDifference);
                choosenIndex = $scope.hasDiamondsArr[i];
            }
        };

        if(choosenIndex > bIndex) {
            elt.target.classList.remove("mine-box-puzzle-bg");
            elt.target.classList.add("mine-box-clue-bg-right");

        } else if(choosenIndex < bIndex) {
            elt.target.classList.remove("mine-box-puzzle-bg");
            elt.target.classList.add("mine-box-clue-bg-left");
        }
    }

    $scope.getBreakLine = function(index) {
        if ((index + 1) % 8 == 1 && index > 0) {
            return true;
        } else {
            return false;
        }
    }


    if(localStorage.getItem("game")) {
        $scope.squares = JSON.parse(localStorage.getItem("game"));
        $scope.hasDiamondsArr = JSON.parse(localStorage.getItem("diamond"));
    } else {
        $scope.createBlockObj();
    }

})