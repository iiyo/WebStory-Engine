
# [command] flicker

Like [flash](flash.md) but flashing the asset multiple times.

## Usage

    . flicker @my_image, :200, times 4, opacity 1

## Attributes

 * **asset/@[asset_name]:** The asset's internal name.
 * **duration/:[value]:** The duration for the effect to last in milliseconds. Default: 500.
 * **times:** The number of times the asset should be flashed. The duration of each flash is duration / times. Default: 10.
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

 * [flash](flash.md)
