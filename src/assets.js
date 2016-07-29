/* global using */

using(
    "WSE.assets.Animation",
    "WSE.assets.Audio",
    "WSE.assets.Background",
    "WSE.assets.Character",
    "WSE.assets.Curtain",
    "WSE.assets.Imagepack",
    "WSE.assets.Textbox",
    "WSE.assets.Composite"
).
define("WSE.assets", function (
    AnimationAsset,
    AudioAsset,
    BackgroundAsset,
    CharacterAsset,
    CurtainAsset,
    ImagepackAsset,
    TextboxAsset,
    CompositeAsset
) {
    
    var assets = {
        Animation: AnimationAsset,
        Audio: AudioAsset,
        Background: BackgroundAsset,
        Character: CharacterAsset,
        Curtain: CurtainAsset,
        Imagepack: ImagepackAsset,
        Textbox: TextboxAsset,
        Composite: CompositeAsset
    };
    
    return assets;
    
});