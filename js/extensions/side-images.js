/*
    Copyright (c) 2012, 2013 The WebStory Engine Contributors
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name WebStory Engine nor the names of its contributors 
      may be used to endorse or promote products derived from this software 
      without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * An extension that adds side-image capabilities.
 * When on a character asset an attribute imagepack is set,
 * the ImagePack referenced by the attribute will be displayed whenever
 * the character says something and hidden when someone else
 * says something.
 */
(function (engine)
{
    "use strict";
    
    var makeToggleSideImagesFn;
    
    engine.extensions = engine.extensions || {};
    
    console.log('Loading extension side-images...');
    
    function makeToggleSideImagesFn (game)
    {
        var lastSpeakerName = '', fn;
        
        fn = function (data)
        {
            var tb, speaker, speakerName, lastSpeaker, ip, ipName, assets, lastIp;
            
            assets = game.interpreter.assets;
            speakerName = data.command.getAttribute('s');
            speaker = assets[speakerName];
            ipName = speaker.asset.getAttribute('imagepack');
            
            //console.log('speakerName: ' + speakerName);
            //console.log('lastSpeakerName: ' + lastSpeakerName);
            
            if (lastSpeakerName == speakerName)
            {
                return;
            }
            
            if (lastSpeakerName !== '')
            {
                lastSpeaker = assets[lastSpeakerName];
                lastIp = assets[lastSpeaker.asset.getAttribute('imagepack')];
                
                if (!lastIp)
                {
                    //console.log('No old imagepack to hide...');
                }
                else
                {
                    //console.log('Hiding old imagepack...');
                    lastIp.hide(data.command, {});
                }
            }
            
            lastSpeakerName = speakerName;
            
            if (!ipName)
            {
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
    
    engine.extensions.sideImages = {
        inject: function (game)
        {
            game.bus.subscribe(makeToggleSideImagesFn(game), 'wse.interpreter.commands.line');
        }
    };
}(WSE));