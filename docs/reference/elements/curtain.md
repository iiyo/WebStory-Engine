
# [asset] curtain

Asset that can be used to implement curtain-like effects. It is basically a colored surface
that can be displayed above other assets to temporarily hide unwanted effects like switching
from one background image to another. In that sense, it acts just like a real curtain would
in a theater.

Note: You can make the curtain transparent by using RGBA colors. The last part of an RGBA
color is the ALPHA channel, that is, the transparency level, where 0 is invisible and 1 is
fully visible.

## Usage

Defining the curtain in the assets section:

    . curtain ~my_curtain, color white

Using the curtain in a scene:

```xml
. show @my_curtain
. wait
. set @my_image, image image_name
. wait
. hide @my_curtain
```

## Attributes

 * **name/~[name]:** The curtain's internal name.
 * **z**: They curtain's z axis value. By default the curtain is shown above all other asset types, that is, it has a high z value.
 * **color:** The color of the curtain. This can be given as the color name or in HEX, RGB or RGBA.
   * Name: "white"
   * HEX: "#FFFFFF"
   * RGB: "rgb(255, 255, 255)"
   * RGBA: "rgba(255, 255, 255, 1)"

## Parents

 * [assets](assets.md)

## Children

 * none

## Related commands

 * [show](show.md)
 * [hide](hide.md)
 * [move](move.md)
 * [flash](flash.md)
 * [flicker](flicker.md)