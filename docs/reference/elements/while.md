
# [command] while

A command that executes a series of contained commands for as long as its condition is met.


## Usage

The following code snippet is executed for as long as the player confirms that they want
to continue playing:

```xml
. while ifvar play, ifvalue true :
    . confirm var play, message "PLAY AGAIN?"
--
```

Please note: This code is only ever executed if the $play variable is initially set to "true".


## Attributes

 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)


## Parents

 * [scene](scene.md)


## Children

 * all commands, including `while` itself
