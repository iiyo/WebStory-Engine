
# [command] prompt

Pops up a dialog, where the player is required to enter some text. The result will be written
to a local variable.

## Usage

    . prompt title "Name?", message "What is your name?", var "player_name"

## Attributes

 * **title:** The prompt dialog's window title.
 * **message:** The question or message to display.
 * **var:** The name of a local variable to write the result into. The result will be "null" if cancel was clicked or "" if nothing has been entered.
 * **prefill:** (Added in v2015.12.1) A default value for the text input.
 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).

## Parents

 * [scene](scene.md)

## Children

 * none

## Related Commands

 * [confirm](confirm.md)
 * [alert](alert.md)
