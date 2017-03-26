
# [command] choice

Command that displays a choice menu. This can be used for simple branching as well as for
setting local variables.

A choice menu must have at least one option. The number of options it can have is only limited
by the stage dimensions.

For more on local variables, see [var](var.md).

## Usage

```xml
. choice :
    
    . option label "Go to another scene now", scene "other_scene"
    
    . option label "Set some variables :
        . var ~my_var1, value whatever
        . var ~my_var1, value whatever
    --
--
```

## Attributes

 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).
 * **cssid:** A CSS ID for styling the choice menu.

## Parents

 * [scene](scene.md)

## Children

 * [option](option.md)

## Related Commands

 * [var](var.md)

