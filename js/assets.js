/* global using */

using(
    "WSE.assets.Animation",
    "WSE.assets.Audio",
    "WSE.assets.Background",
    "WSE.assets.Character",
    "WSE.assets.Curtain",
    "WSE.assets.Imagepack",
    "WSE.assets.Textbox"
).
define("WSE.assets", function (
    AnimationAsset,
    AudioAsset,
    BackgroundAsset,
    CharacterAsset,
    CurtainAsset,
    ImagepackAsset,
    TextboxAsset
) {
    
    var assets = {
        Animation: AnimationAsset,
        Audio: AudioAsset,
        Background: BackgroundAsset,
        Character: CharacterAsset,
        Curtain: CurtainAsset,
        Imagepack: ImagepackAsset,
        Textbox: TextboxAsset
    };
    
    return assets;
    
});