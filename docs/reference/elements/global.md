
# [command] global

Sets a global variable. Global variables do not get deleted automatically when a
[`restart`](restart.md) command is issued. The can be used to implement meta features,
e.g. enabling things only after a player finished the game once.

## Usage

```xml
. global ~my_var, +value

(( n: Global my_var is: {$$my_var} ))
```

## Attributes

 * **name**: The name of the variable to set.
 * **value**: The value for the variable.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none

## Related commands

 * [globalize](globalize.md)
 * [localize](localize.md)
 * [var](var.md)
