
# [command] transform

A command that is to be used within [animation](animation.md) [groups](group.md).

The `transform` command manipulates a CSS property of an asset's DOM Element.


## Usage

See [animation](animation.md).


## Attributes

 * **asset/@[asset_name]:** The name of the asset to manipulate.
 * **property:** The CSS property to manipulate. Can be any CSS property with decimal values.
   Refer to a CSS guide to finde the one that fits your purpose.
 * **from:** The start value without unit.
 * **to:** The end value without unit.
 * **unit:** The unit, e.g. "px", "%" or "em".
 * **duration:** How long the transformation should take in milliseconds.
 * **easing:** The easing type to use. See [easing](easing_attribute.md).


## Parents

 * [group](group.md)


## Children

 * none


## Related Assets

 * [animation](animation.md)


## Related Commands

 * [do](do.md)
