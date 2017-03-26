
# [asset] imagepack

The ImagePack asset bundles related images together so that effects can be used on all
the images at once.

For a more versatile way of displaying a bundle of images,
see the [composite asset](composite.md).

## Usage

```
. imagepack ~my_sprites, x 200px, y 20px, z 500 :
    . image ~smiling, src assets/images/smiling.png
    . image ~sulking, src assets/images/sulking.png
--
```

## Attributes

 * **name/~[name]:** The imagepack's internal name.
 * **x**: The initial horizontal position of the relative to the upper left corner of the stage.
   Supported units: px and %.
 * **y**: The same as the x attribute, but for the vertical position.
 * **z**: The z-index of the imagepack. Determines the order in which assets are displayed.


## Parents

 * [assets](assets.md)

## Children

 * [image](image.md)

## Related commands

 * [set](set.md)
 * [show](show.md)
 * [hide](hide.md)
 * [move](move.md)
 * [flash](flash.md)
 * [flicker](flicker.md)
