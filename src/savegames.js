
var each = require("enjoy-core/each");
var typechecks = require("enjoy-typechecks");

var engine = require("./engine");
var tools = require("./tools/tools");

var isNull = typechecks.isNull;
var isUndefined = typechecks.isUndefined;

var warn = tools.warn;
var truthy = tools.truthy;

function load (interpreter, name) {
    
    var ds, savegame, scene, sceneId, scenePath, scenes;
    var savegameId, bus = interpreter.bus;
    
    savegameId = buildSavegameId(interpreter, name);
    ds = interpreter.datasource;
    savegame = ds.get(savegameId);
    
    bus.trigger(
        "wse.interpreter.load.before",
        {
            interpreter: interpreter,
            savegame: savegame
        }, 
        false
    );
    
    if (!savegame) {
        warn(bus, "Could not load savegame '" + savegameId + "'!");
        return false;
    }
    
    savegame = JSON.parse(savegame);
    interpreter.stage.innerHTML = savegame.screenContents;
    
    restoreSavegame(interpreter, savegame.saves);
    
    interpreter.startTime = savegame.startTime;
    interpreter.runVars = savegame.runVars;
    interpreter.log = savegame.log;
    interpreter.visitedScenes = savegame.visitedScenes;
    interpreter.index = savegame.index;
    interpreter.wait = savegame.wait;
    interpreter.waitForTimer = savegame.waitForTimer;
    interpreter.currentElement = savegame.currentElement;
    interpreter.callStack = savegame.callStack;
    interpreter.waitCounter = savegame.waitCounter;
    interpreter.state = "listen";
    
    sceneId = savegame.sceneId;
    interpreter.sceneId = sceneId;
    
    scenes = interpreter.story.getElementsByTagName("scene");
    interpreter.scenes = scenes;
    
    scene = find(function (scene) {
        return scene.getAttribute("id") === sceneId;
    }, interpreter.scenes);
    
    if (!scene) {
        
        bus.trigger(
            "wse.interpreter.error",
            {
                message: "Loading savegame '" + savegameId + "' failed: Scene not found!"
            }
        );
        
        return false;
    }
    
    scenePath = savegame.scenePath;
    interpreter.scenePath = scenePath.slice();
    
    interpreter.currentCommands = scene.childNodes;
    
    while (scenePath.length > 0) {
        interpreter.currentCommands = interpreter.currentCommands[scenePath.shift()].childNodes;
    }
    
    // Re-insert choice menu to get back the DOM events associated with it:
    // Remove savegame menu on load:
    (function (interpreter) {
        
        var index, wseType, com, rem;
        
        each(function (cur) {
            
            if (isUndefined(cur) || isNull(cur)) {
                return;
            }
            
            wseType = cur.getAttribute("data-wse-type") || "";
            rem = truthy(cur.getAttribute("data-wse-remove"));
            
            if (rem === true) {
                interpreter.stage.removeChild(cur);
            }
            
            if (wseType !== "choice") {
                return;
            }
            
            index = parseInt(cur.getAttribute("data-wse-index"), 10) || null;
            
            if (index === null) {
                warn(interpreter.bus, "No data-wse-index found on element.");
                return;
            }
            
            com = interpreter.currentCommands[index];
            
            if (com.nodeName === "#text" || com.nodeName === "#comment") {
                return;
            }
            
            interpreter.stage.removeChild(cur);
            engine.commands.choice(com, interpreter);
            interpreter.waitCounter -= 1;
            
        }, interpreter.stage.getElementsByTagName("*"));
        
    }(interpreter));
    
    bus.trigger(
        "wse.interpreter.load.after",
        {
            interpreter: interpreter,
            savegame: savegame
        }, 
        false
    );
    
    return true;
}

function save (interpreter, name) {
    
    name = name || "no name";
    
    var savegame, json, key, savegameList, listKey, lastKey, bus = interpreter.bus;
    
    savegame = {};
    
    bus.trigger(
        "wse.interpreter.save.before",
        {
            interpreter: interpreter,
            savegame: savegame
        }, 
        false
    );
    
    savegame.saves = createSavegame(interpreter);
    savegame.startTime = interpreter.startTime;
    savegame.saveTime = Math.round(Date.now() / 1000);
    savegame.screenContents = interpreter.stage.innerHTML;
    savegame.runVars = interpreter.runVars;
    savegame.name = name;
    savegame.log = interpreter.log;
    savegame.visitedScenes = interpreter.visitedScenes;
    savegame.gameUrl = interpreter.game.url;
    savegame.index = interpreter.index;
    savegame.wait = interpreter.wait;
    savegame.waitForTimer = interpreter.waitForTimer;
    savegame.currentElement = interpreter.currentElement;
    savegame.sceneId = interpreter.sceneId;
    savegame.scenePath = interpreter.scenePath;
    savegame.listenersSubscribed = interpreter.game.listenersSubscribed;
    savegame.callStack = interpreter.callStack;
    savegame.waitCounter = interpreter.waitCounter;
    savegame.pathname = location.pathname;
    
    key = buildSavegameId(interpreter, name);
    
    json = JSON.stringify(savegame);
    
    listKey = "wse_" + savegame.pathname + "_" + savegame.gameUrl + "_savegames_list";
    
    savegameList = JSON.parse(interpreter.datasource.get(listKey));
    savegameList = savegameList || [];
    lastKey = savegameList.indexOf(key);
    
    if (lastKey >= 0) {
        savegameList.splice(lastKey, 1);
    }
    
    savegameList.push(key);
    
    try {
        interpreter.datasource.set(key, json);
        interpreter.datasource.set(listKey, JSON.stringify(savegameList));
    }
    catch (e) {
        
        warn(bus, "Savegame could not be created!");
        
        bus.trigger(
            "wse.interpreter.save.after.error",
            {
                interpreter: interpreter,
                savegame: savegame
            }, 
            false
        );
        
        return false;
    }
    
    bus.trigger(
        "wse.interpreter.save.after.success",
        {
            interpreter: interpreter,
            savegame: savegame
        }
    );
    
    return true;
}

function createSavegame (interpreter) {
    
    var saves = {};
    
    each(function (asset, key) {
        
        try {
            saves[key] = asset.save();
        }
        catch (e) {
            console.error("WSE Internal Error: Asset '" + key + 
                "' does not have a 'save' method!");
        }
        
    }, interpreter.assets);
    
    return saves;
}

function restoreSavegame (interpreter, saves) {
    
    each(function (asset, key) {
        
        try {
            asset.restore(saves[key]);
        }
        catch (e) {
            console.error(e);
            warn(interpreter.bus, "Could not restore asset state for asset '" + key + "'!");
        }
        
    }, interpreter.assets);
    
}

function buildSavegameId (interpreter, name) {
    
    var vars = {};
    
    vars.name = name;
    vars.id = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegame_" + name;
    
    interpreter.bus.trigger(
        "wse.interpreter.save.before",
        {
            interpreter: interpreter,
            vars: vars
        }, 
        false
    );
    
    return vars.id;
}

function getSavegameList (interpreter, reversed) {
    
    var names;
    var out = [];
    var key = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list";
    var json = interpreter.datasource.get(key);
    
    if (json === null) {
        return out;
    }
    
    names = JSON.parse(json);
    out = [];
    
    each(function (name) {
        
        if (reversed === true) {
            out.unshift(JSON.parse(interpreter.datasource.get(name)));
        }
        else {
            out.push(JSON.parse(interpreter.datasource.get(name)));
        }
        
    }, names);
    
    interpreter.bus.trigger(
        "wse.interpreter.getsavegamelist",
        {
            interpreter: interpreter,
            list: out,
            names: names
        }, 
        false
    );
    
    return out;
}

function remove (interpreter, name) {
    
    var sgs, key, index, json, id;
    
    key = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list";
    json = interpreter.datasource.get(key);
    
    if (json === null) {
        return false;
    }
    
    sgs = JSON.parse(json);
    id = buildSavegameId(interpreter, name);
    index = sgs.indexOf(id);
    
    if (index >= 0) {
        
        sgs.splice(index, 1);
        
        interpreter.datasource.set(
            "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list",
            JSON.stringify(sgs)
        );
        
        interpreter.datasource.remove(id);
        
        return true;
    }
    
    return false;
}

module.exports = {
    save: save,
    load: load,
    remove: remove,
    getSavegameList: getSavegameList
};
