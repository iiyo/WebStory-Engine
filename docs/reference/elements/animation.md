
# [asset] animation

An asset describing an animation using other assets.

An animation is divided into [group](group.md) elements. The group elements can contain [transform](transform.md) elements or [do](do.md) elements which manipulate some property of another asset. All commands inside a group will be executed simultaneously, while the groups will be executed one after another.

An animation can be started using the [[language:elements:start_command]] command and it will then loop until  the corresponding [stop](stop.md) command is used.

**Note:** Animations are executed parallel to the normal game flow, in the background.

**Warning:** Be aware that when an asset is currently animated, changing the asset's currently animated properties might break the animation or make it look ugly. It's safer to only change what is not currently being animated.
## Usage

Animating a character sprite to blink the eyes:

```
. animation ~my_anim :
    . group :
        . do @my_character_sprite, action set, image eyes_open
    --
    . group :
        . do @my_character_sprite, action set, image eyes_half_closed
    --
    . group :
        . do @my_character_sprite, action set, image eyes_closed
    --
--
```

Moving an imagepack in a diamond shape, taking 1 second for each full round:

```
. animation ~my_anim :
    . group :
        . do @my_imagepack, action move, x 200px, y 100px, :250, easing linear
    --
    . group :
        . do @my_imagepack, action move, x 100px, y 200px, :250, easing linear
    --
    . group :
        . do @my_imagepack, action move, x 0, y 100px, :250, easing linear
    --
    . group :
        . do @my_imagepack, action move, x 100px, y 0, :250, easing linear
    --
--
```

The same animation as above, but this time using the transform command which acts directly upon a CSS property of an asset:

```
. animation ~my_anim :
    . group :
        . transform @my_imagepack, property left, from 100, to 200, unit px, :250, easing linear
        . transform @my_imagepack, property top, from 0, to 100, unit px, :250, easing linear
    --
    . group :
        . transform @my_imagepack, property left, from 200, to 100, unit px, :250, easing linear
        . transform @my_imagepack, property top, from 100, to 200, unit px, :250, easing linear
    --
    . group :
        . transform @my_imagepack, property left, from 100, to 0, unit px, :250, easing linear
        . transform @my_imagepack, property top, from 200, to 100, unit px, :250, easing linear
    --
    . group :
        . transform @my_imagepack, property left, from 0, to 100, unit px, :250, easing linear
        . transform @my_imagepack, property top, from 100, to 0, unit px, :250, easing linear
    --
--
```

## Attributes

 * **name:** The animation's internal name, used to reference it in commands.

## Parents

 * [scene](scene.md)

## Children

 * [group](group.md)

## Related Commands

 * [start](start.md)
 * [stop](stop.md)

