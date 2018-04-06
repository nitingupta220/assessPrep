var app = angular.module('wordGame', []);
app.controller('wordGameController', function ($window, $scope, $http) {

    var appCtrl = this;
    
//     using localstorage to store the level of the game
    appCtrl.localStorage = $window.localStorage;
    
    appCtrl.answer = [];

    var correctAnswer;
    var answerIndex = {};

//    answers of different stages
    var stagesKeywords = ['nature', 'love', 'superhero'];

//    splitting the answers to compare with the predefined answers
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
    
    
//    generating the hints for the question which user can select to predict the answer
    var generateHints = function (searchKeyword) {
        var possible = "abcdefghijklmnopqrstuvwxyz";
        var remaningItems = 10 - searchKeyword.length;

        for (var i = 0; i < remaningItems; i++) {
            searchKeyword += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        appCtrl.answerHints = searchKeyword.shuffle();
    };

    
    
    

    var initQuiz = function () {
        var shuffledString;

        if ($window.localStorage.stage && $window.localStorage.stage !== "11") {
            correctAnswer = stagesKeywords[JSON.parse($window.localStorage.stage) - 1];
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

//    Adding the answer to the input box
    appCtrl.addAnswers = function (key, answer) {
        var pushItemIndex = appCtrl.answer.indexOf('');
        console.log(pushItemIndex);
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

//    removing the answer from the input box
    appCtrl.removeAnswers = function (index, answer) {
        var hintsKey = answerIndex[index];
        appCtrl.answerHints[hintsKey] = answer;
        appCtrl.answer[index] = '';
    };





    initQuiz();

});
