
# [command] flash

Flashes a displayable asset by rapidly raising it's opacity and then making it invisible
again a little slower.

## Usage

    . flash @my_image, :200, opacity 1

## Attributes

 * **asset:** The asset's internal name.
 * **duration:** The duration for the effect to last in milliseconds. Default: 500.
 * **opacity:** The maximum opacity to use. Default is 1. Values can range from 0 (invisible) to 1 (fully visible).
 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).
## Parents

 * [scene](scene.md)

## Children

 * none

## Related Assets

 * [imagepack](imagepack.md)
 * [textbox](textbox.md)
 * [curtain](curtain.md)

## Related Commands

 * [flicker](flicker.md)

