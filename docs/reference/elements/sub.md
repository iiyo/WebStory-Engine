
# [command] sub

With the `sub` command, you can use any scene as a sub routine of another scene. The command
is basically the same as the [goto](goto.md) command, with the difference that after the
scene which was entered using `sub` has no more commands to execute, the control flow will
return to the scene in which the `sub` command was used and execute the remaining commands there.

**Note:** You can use `sub` in scenes which where itself called using a `sub` command.
This way, you can implement some kind of primitive recursion.

**Warning:** Do not jump to the same scene in which the `sub` command is used.
This would cause an endless loop and using up more memory each time the sub scene is entered.
If you **want** an endless loop, use the [goto](goto.md) command instead.


## Usage

    . sub scene my_other_scene


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

 * [goto](goto.md)
