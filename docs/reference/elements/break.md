
# [command] break

Stops the control flow and waits for the user to trigger the advancement ("next") action.

This can be useful if you want to implement some kind of slide show or when you want to display
text as images and want to let the user deceide when the story should continue.

The "next" action by default is when the user clicks on the stage. It can also be bound to
buttons using [trigger](trigger.md)s.

## Usage

    . show @my_image
    . break
    . hide @my_image

Explanation: `show` is executed immediately, `hide` only after the user clicked on the screen or
pushed a button associated with "next".

## Attributes

 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none

## Related commands

 * [wait](wait.md)

