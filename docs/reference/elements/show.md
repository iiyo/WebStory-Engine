
# [command] show

Makes a displayable asset visible on the stage.

It is important to note that the "slide" effect will NOT alter the assets position. Instead,
it will translate it for exactly the width and height of the stage and than slide it back in.


## Usage

Show asset using defaults, which is a fade-in effect with a duration of 500 milliseconds:

    . show @my_asset

Show asset using fade-in effect for 2 seconds:

    . show @my_asset, :2000

Show asset using slide effect for 1 second going from left to right:

    . show @my_asset, :1000, effect slide, direction right

Show asset using slide effect for 1 second going from left to right with a bouncy effect:

    . show @my_asset, :1000, effect slide, direction right, easing easeOutBounce


## Attributes

| Name        | Shorthand    | Description                                                    |
|:------------|:-------------|:---------------------------------------------------------------|
| asset       | @[value]     | The asset to make visible.                                     |
| effect      |              | Effect to use: "slide" or "fade".                              |
| duration    | :[value]     | Duration of the effect in milliseconds.                        |
| direction   |              | Direction for slide effect: "left", "right", "top" or "bottom" |
| easing      |              | See [easing](easing_attribute.md).                           |
| ifvar       |              | See [conditionals](conditionals.md).                         |
| ifvalue     |              | See [conditionals](conditionals.md).                         |
| ifnot       |              | See [conditionals](conditionals.md).                         |


## Parents

 * [scene](scene.md)


## Children

 * none; empty element


## Related commands

 * [hide](hide.md)
 * [move](move.md)
