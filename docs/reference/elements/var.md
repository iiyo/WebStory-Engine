
# [command] var

Sets or manipulates a local variable. Local variables are not local in the sense of being
local to a scene; rather, they exist everywhere within the story, but only on the current.
When the [restart](restart.md) command is executed, local variables
are deleted. If you want to have variables that remain even after the story has finished,
use [global](global.md) insted.

Local variables are part of savegames.


## Usage

Local variables can be used in line commands using the following syntax:

    (( n: The value of myVar is: {$myVar} ))


## Attributes

 * **name/~[variable_name]**: The variable's name.
 * **action**: An action to perform on the variable. Default is "set" which defines the
   variable. May be one of:
   * **set**: Sets the variable to a value.
   * **increase**: Adds 1 to the variable's value.
   * **decrease**: Substracts 1 from the variable's value.
   * **delete**: Unsets the variable.
   * **print**: Prints the variable's value to the browser's web console for debugging purposes.
 * **value**: The value to set the variable to when action is "set".
 * **ifvar:** See [conditionals](conditionals.md).
 * **ifvalue:** See [conditionals](conditionals.md).
 * **ifnot:** See [conditionals](conditionals.md).


## Parents

 * [scene](scene.md)
 * [option](option.md)


## Children

 * none


## Related commands

 * [localize](localize.md)
 * [global](global.md)
 * [globalize](globalize.md)
