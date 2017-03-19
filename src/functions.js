
var functions = {
    
    savegames: function (interpreter) {
        interpreter.toggleSavegameMenu();
    },
    
    stageclick_disable: function (interpreter) {
        interpreter.game.unsubscribeListeners();
    },
    
    stageclick_enable: function (interpreter) {
        interpreter.game.subscribeListeners();
    }
    
};

module.exports = functions;
