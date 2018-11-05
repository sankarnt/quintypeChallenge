/**
 * @controller: it has the functionality of the game
*/
app.controller("mineSweepController", function($scope){
    $scope.createBlockObj = function() {   // this function creates the blocks for the game
        var diamondCount = 1;
        $scope.squares= [];
        $scope.hasDiamondsArr = [];
        for (var index = 0; index < 64; index++) {
            var randonIndex = $scope.getRandomObj(); // this function is to show the diamonds in the random index
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
/**
 * @description : this function return random index with range from 0 - 64
 */
    $scope.getRandomObj = function() {
        var min = 0; 
        var max = 64;
        var randomInd = parseInt(Math.random() * (+max - +min) + +min); 
        if($scope.hasDiamondsArr.indexOf(randomInd) > -1){ // its to get the random index without duplicate values
            $scope.getRandomObj();
        } else{
            return randomInd;
        }
    }

/**
 * @description : its for showing the diamond, if the clicked box has diamond or for getting the closest index and saved the data in the localstorage
*/

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

    
    $scope.prevClickedElt = null; // to save the clicked element

/**
 * @desc :  function is to get the direction of the  nearest diamond from the clicked one
 * @param : it takes, the clicked box object and the target element
*/    
    $scope.getClueDirection = function(box, elt) {
        var bIndex = box.index;
        var minDifference;
        var choosenIndex;
        
        if($scope.prevClickedElt) { // to hide the previously shown arrows
            $scope.prevClickedElt.classList.remove("mine-box-clue-bg-left");
            $scope.prevClickedElt.classList.remove("mine-box-clue-bg-right");
        }
        $scope.prevClickedElt = elt.target;
        for (var i = 0; i < $scope.hasDiamondsArr.length; i++) { // loop to find the smallest difference
            var tempDifference = bIndex - $scope.hasDiamondsArr[i];
            if(typeof(minDifference) === "undefined"){
                minDifference = Math.abs(tempDifference);
                choosenIndex = $scope.hasDiamondsArr[i];
            } else if(Math.abs(tempDifference) < minDifference){
                minDifference = Math.abs(tempDifference);
                choosenIndex = $scope.hasDiamondsArr[i];
            }
        };

        if(choosenIndex > bIndex) { // if the closest index is greater than the clicked index , right arrow will be shown
            elt.target.classList.remove("mine-box-puzzle-bg");
            elt.target.classList.add("mine-box-clue-bg-right");

        } else if(choosenIndex < bIndex) { // if the closest index is lesser than the clicked index , left arrow will be shown
            elt.target.classList.remove("mine-box-puzzle-bg");
            elt.target.classList.add("mine-box-clue-bg-left");
        }
    }


/**
 * desc: this function is to break the line after every 8 block
 * params : it gets the index from the event call
 * return: and it returns boolean if the mod of 8 is 1
 */
    $scope.getBreakLine = function(index) {
        if ((index + 1) % 8 == 1 && index > 0) {
            return true;
        } else {
            return false;
        }
    }


    if(localStorage.getItem("game")) { // checks for the saved data 
        $scope.squares = JSON.parse(localStorage.getItem("game"));
        $scope.hasDiamondsArr = JSON.parse(localStorage.getItem("diamond"));
    } else { // if no data is there, it gets a fresh data
        $scope.createBlockObj();
    }

})