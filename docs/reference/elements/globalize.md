
# [command] globalize

Copies a local variable's value into a global variable with the same name.

## Usage

```xml
. var ~my_var, +value
. globalize ~my_var

(( n: The value of global variable my_var is: {$$my_var} ))
```

## Attributes

 * **name:** The name of the variable to globalize.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none; empty element

## Related commands

 * [global](global.md)
 * [localize](localize.md)
 * [var](var.md)
