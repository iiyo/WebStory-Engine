
# [command] clear

This command clears the contents of a [textbox](textbox.md).

**Note:** It is only necessary to use this on textboxes with NVL behaviour. ADV textboxes
are cleared automatically whenever a new line is displayed on it. See [textbox](textbox.md)
for details about NVL and ADV.

## Usage

```xml
(( n: This is a line, displayed on an NVL textbox. ))
(( n: This line will be displayed on the textbox, while the first on is still there. ))

. clear @my_tb

(( n: This is now the only line on the textbox, because it has been cleared before. ))
```

## Attributes

 * **asset/@[name]:** The textbox's internal name.
 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).

## Parents

 * [scene](scene.md)

## Children

 * none

## Related Assets

 * [textbox](textbox.md)
 * [character](character.md)

## Related Commands

 * [line](line.md)

