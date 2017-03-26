
# [command] do

A generic command to use a command on an asset that does not have it's own element or
as generic command inside of [animations](animation.md).

The action attribute of the do command corresponds to the command being executed on the asset.
That means it has the same attributes as the named command, e.g. [show](show.md),
and additionally the action attribute to specify the command.

In this sense, the do command is a bit like a shapeshifter.

**Note for extension developers:** It is always better to create a named command because
it is a lot less verbose. The do command is mainly there to use existing commands inside
of animations.

## Usage

Usage in scenes:

```xml
<!-- This: -->
. do @my_image, action set, image smiling
<!-- Does the same as this: -->
. set @my_image, image smiling
```

See also the usage examples here: [animation](animation.md).

## Attributes

 * **asset/@[asset_name]:** The name of the asset to act upon.
 * **action:** The action to perform. Can be all of the other commands that act upon an asset.
 * **ifvar:** (Only in scenes) See [conditionals](conditionals.md).
 * **ifvalue:** (Only in scenes) See [conditionals](conditionals.md).
 * **ifnot:** (Only in scenes) See [conditionals](conditionals.md).

## Parents

 * [scene](scene.md)
 * [group](group.md)

## Children

 * none

## Related Commands

 * [transform](transform.md)
 * all other commands
