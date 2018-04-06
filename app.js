var app = angular.module('wordGame', []);
app.controller('wordGameController', function ($window, $scope, $http) {

    //    images to be shown
    $scope.images = [
        {
            id: 1,
            imageUrl: 'media/0.jpg'
        }, {
            id: 2,
            imageUrl: 'media/1.jpg'
        }, {
            id: 3,
            imageUrl: 'media/2.jpg'
        }, {
            id: 4,
            imageUrl: 'media/3.jpg'
        }
    ];


    var appCtrl = this;

    //    using localStorage to store the level of the game 
    appCtrl.localStorage = $window.localStorage;
    appCtrl.answer = [];

    var correctAnswer;
    var answerIndex = {};


    //    answers of different stages of the game
    var stagesKeywords = ['family', 'ball', 'usa', 'gift'];


    //    function which can split all the words and return a object
    String.prototype.shuffle = function () {
        var splitString = this.split(""),
            stringLength = splitString.length,
            stringObject = {};

        for (var i = 0; i < stringLength; i++) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = splitString[i];
            splitString[i] = splitString[j];
            stringObject[i] = splitString[j];
            splitString[j] = tmp;
            stringObject[j] = tmp;
        }

        return stringObject;
    };


    var initAnswerIndex = function (indexLength) {
        for (var i = 0; i < indexLength; i++) {
            answerIndex[i] = '';
        }
    };

    var getTimes = function (num) {
        return new Array(num);
    };

    //    generating hints
    var generateHints = function (searchKeyword) {
        //        maximum words that one can enter
        var possible = "abcdefghijklmnopqrstuvwxyz";
        var remaningItems = 10 - searchKeyword.length;

        //        using for loop and Math.random to randomly generating the hints and later will use this with the correctAnswer
        for (var i = 0; i < remaningItems; i++) {
            searchKeyword += possible.charAt(Math.floor(Math.random() * possible.length));
        }


        appCtrl.answerHints = searchKeyword.shuffle();
    };

    //    initialize the quiz
    var initQuiz = function () {
        var shuffledString;


        if ($window.localStorage.stage && $window.localStorage.stage !== "11") {
            correctAnswer = stagesKeywords[JSON.parse($window.localStorage.stage) - 1];
            console.log(correctAnswer);
            generateHints(correctAnswer);
            initAnswerIndex(correctAnswer.length);
            appCtrl.answerLength = getTimes(correctAnswer.length);
        } else if (!$window.localStorage.stage) {
            $window.localStorage.stage = 1;
            correctAnswer = stagesKeywords[0];
            generateHints(correctAnswer);
            initAnswerIndex(correctAnswer.length);
            appCtrl.answerLength = getTimes(correctAnswer.length);
        }
    };

    
//    adding your answers in the input box
    appCtrl.addAnswers = function (key, answer) {
        var pushItemIndex = appCtrl.answer.indexOf('');
        if (pushItemIndex === -1 && appCtrl.answer.length !== correctAnswer.length) {
            appCtrl.answer.push(answer);
            var answerKeyIndex = appCtrl.answer.length - 1;
            answerIndex[answerKeyIndex] = key;
            appCtrl.answerHints[key] = '';
        } else if (appCtrl.answer.length !== correctAnswer.length || pushItemIndex >= 0) {
            appCtrl.answer[pushItemIndex] = answer;
            answerIndex[pushItemIndex] = key;
            appCtrl.answerHints[key] = '';
        }

    };

//    removing the wrong inputs from input box
    appCtrl.removeAnswers = function (index, answer) {
        var hintsKey = answerIndex[index];
        appCtrl.answerHints[hintsKey] = answer;
        appCtrl.answer[index] = '';
    };

//    submit the answer accepts if your answer is correct and reject if not
    appCtrl.submitQuestion = function () {
        if (appCtrl.answer.length === correctAnswer.length && appCtrl.answer.indexOf('') === -1) {
            if (correctAnswer === appCtrl.answer.join('')) {
                alert('Correct Answer!');
                currentStage = JSON.parse($window.localStorage.stage);
                if (currentStage < stagesKeywords.length) {
                    $window.localStorage.stage = ++currentStage;
                    appCtrl.answer = [];
                    initQuiz();
                } else {
                    alert('Congrats! You finished this game. Now this game will be reset to stage 1');
                    $window.localStorage.stage = 1;
                    appCtrl.answer = [];
                    initQuiz();
                }
            } else {
                alert('Your answer is incorrect!');
            }
        } else {
            alert('Please fill all the boxes');
        }
    };




    initQuiz();
});
