
# [asset] composite

The composite asset allows you to display related images as a group. Instead of showing just
one image at a time like the imagepack asset, it let's you show many images at once which
makes it possible to have character images with many different layers and styles
(e.g. separate accessoires and clothing).

```xml
. composite name cecile :
    . image src base_left.png, tags left
    . image src base_right.png, tags right
    . image src smile_left.png, tags "smile_left, left"
    . image src smile_right.png, tags "smile_right, right"
    . image src hat_left.png, tags "hat_left, left"
    . image src hat_right.png, tags "hat_right, right"
--
```

Each image is associated with one or more tags. The composite asset has a list of currently
active tags and it displays all of the images which contain at least one of the active tags.

You can use the [tag](tag.md) command to change the currently active
tags on a composite asset.

In the example above, if you wanted to show the character facing to the left, you could write:

    . tag @cecile, add "left, smile_left", remove *

And if you wanted to let it face to the right instead, you could write:

    . tag @cecile, add "right, smile_right", remove *
