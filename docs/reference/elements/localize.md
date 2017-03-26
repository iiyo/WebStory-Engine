
# [command] localize

Copies a global variable's value into a local variable with the same name.

## Usage

```xml
. global ~my_var, +value
. localize ~my_var

(( n: Local my_var is: {$my_var} ))
```

## Attributes

 * **name/~[name]:** The name of the global variable to be localized.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none; empty element

## Related commands

 * [global](global.md)
 * [globalize](globalize.md)
 * [var](var.md)
