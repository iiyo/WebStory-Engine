
# [command] move

Moves an asset on the stage.

## Usage

    . move @my_image, x 200px, y 50px, :1000, easing easeOutQuad

## Attributes

 * **asset/@[asset_name]:** The asset to act upon.
 * **x:** The new horizontal position (x axis). Unit can be pixel or %.
 * **y:** The new vertical position (y axis). Unit can be pixel or %.
 * **z:** The new asset's z-index (display order priority). Assets with high z will be displayed on top of assets with lower z values.
 * **duration/:[value]:** Duration in milliseconds after which the asset should be at it's new position.
 * **easing:** See [[language:attributes:easing]]
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

Since version 2015.10.1:

 * **xAnchor:** The point to be used as an anchor for the movement on the x axis (default: 0).
 * **yAnchor:** The point to be used as an anchor for the movement on the y axis (default: 0).

## Parents

 * [scene](scene.md)

## Children

 * none

## Supported Assets

 * [imagepack](imagepack.md)
 * [textbox](textbox.md)
 * [curtain](curtain.md)

## Related Commands

 * [show](show.md)
 * [hide](hide.md)
 * [flash](flash.md)
 * [flicker](flicker.md)
