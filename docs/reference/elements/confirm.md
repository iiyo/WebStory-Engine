
# [command] confirm

Pops up a confirmation dialog, where the player is required to answer a yes-no question.
The result will be written to a local variable.

## Usage

```xml
. confirm title "Delete variable?", message "Do you really want to delete this variable?", var the_answer
```

## Attributes

 * **title:** The confirm dialog window's title.
 * **message:** The question or message to display.
 * **var:** The name of a local variable to write the result into. The result will be "false" or "true".
 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).

## Parents

 * [scene](scene.md)

## Children

 * none

## Related Commands

 * [prompt](prompt.md)
 * [alert](alert.md)

