/* global using */

/**
 * An extension that adds side-image capabilities.
 * When on a character asset an attribute imagepack is set,
 * the ImagePack referenced by the attribute will be displayed whenever
 * the character says something and hidden when someone else
 * says something.
 */
using().define("WSE.extensions.sideImages", function () {
    
    "use strict";
    
    console.log('Loading extension side-images...');
    
    function makeToggleSideImagesFn (game) {
        
        var lastSpeakerName = '', fn;
        
        fn = function (data) {
            
            var tb, speaker, speakerName, lastSpeaker, ip, ipName, assets, lastIp;
            
            assets = game.interpreter.assets;
            speakerName = data.command.getAttribute('s');
            speaker = assets[speakerName];
            ipName = speaker.asset.getAttribute('imagepack');
            
            //console.log('speakerName: ' + speakerName);
            //console.log('lastSpeakerName: ' + lastSpeakerName);
            
            if (lastSpeakerName == speakerName) {
                return;
            }
            
            if (lastSpeakerName !== '') {
                
                lastSpeaker = assets[lastSpeakerName];
                lastIp = assets[lastSpeaker.asset.getAttribute('imagepack')];
                
                if (!lastIp) {
                    //console.log('No old imagepack to hide...');
                }
                else {
                    //console.log('Hiding old imagepack...');
                    lastIp.hide(data.command, {});
                }
            }
            
            lastSpeakerName = speakerName;
            
            if (!ipName) {
                return;
            }
            
            tb = assets[speaker.asset.getAttribute('textbox')];
            ip = assets[ipName];
            
            //console.log('Showing new imagepack...');
            ip.show(data.command, {});
        };
        
        game.bus.subscribe(function () { lastSpeakerName = ''; }, 'wse.interpreter.restart');
        
        return fn;
    };
    
    return function (game) {
        game.bus.subscribe(makeToggleSideImagesFn(game), 'wse.interpreter.commands.line');
    };
});