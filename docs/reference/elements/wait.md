
# [command] wait

The wait element can be used to postpone the execution of the next commands until
the previous commands have finished executing, e.g. any effects used.

If used together with the duration attribute, the interpreter will wait for the number
of milliseconds specified in the attribute before the following commands will be executed,
regardless of whether there are any other commands still executing.


## Usage

```
. show @myTextbox, :1200

<!-- Waits around 1200 milliseconds, that is until the show command is finished: -->
. wait

<!-- Waits another second: -->
. wait :1000
```


## Attributes

 * **duration/:[length]**: A number of milliseconds to wait. Optional.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)


## Parents

 * [scene](scene.md)


## Children

 * none; it is a single-tag element.


## Related elements

 * [break](break.md)
