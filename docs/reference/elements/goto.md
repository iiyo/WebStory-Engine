
# [command] goto

Leaves the current scene and jumps to the beginning of another.

The control flow will not return to the scene from which the `goto` command is issued.
That means if you use an unconditional goto, any elements written after the goto will
never be reached.

## Usage

    . goto scene my_other_scene

## Attributes

| Name      | Shortcut | Description                                  |
|:---------:|:--------:|:---------------------------------------------|
| scene     |          | The ID of the scene to use as a sub routine. |
| ifvar     |          | See [conditionals](conditionals.md)        |
| ifvalue   |          | See [conditionals](conditionals.md)        |
| ifnot     |          | See [conditionals](conditionals.md)        |


## Parents

 * [scene](scene.md)

## Children

 * none

## Related commands

 * [sub](sub.md)

