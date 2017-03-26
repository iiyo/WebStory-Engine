
# [command] hide

Removes a displayable asset from the stage.

It is important to note that the "slide" effect will NOT alter the assets position.
Instead, it will translate it for exactly the width and height of the stage, make it
invisible and then put it back on the old position.


## Usage

Hide asset using defaults, which is a fade-out effect with a duration of 500 milliseconds:

    . hide @my_asset

Hide asset using fade-out effect for 2 seconds:

    . hide @my_asset, :2000

Hide asset using slide effect for 1 second going from left to right:

    . hide @my_asset, :1000, effect slide, direction right

Hide asset using slide effect for 1 second going from left to right with a bouncy effect:

    . hide @my_asset, :1000, effect slide, direction right, easing easeOutBounce


## Attributes

| Name        | Shorthand    | Description                                                    |
|:------------|:-------------|:---------------------------------------------------------------|
| asset       | @[value]     | The asset to remove from the stage.                            |
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

 * [show](show.md)
 * [move](move.md)
