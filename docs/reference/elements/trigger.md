
# [setting] trigger

Defines a trigger. Triggers can be used to bind a key to some kind of action, like the
advancement ("next") action or toggling the savegame menu.

Note: There is also a command named [trigger](trigger_command.md).

Triggers are not automatically activated after their creation. You need to explicitly activate
them using the [trigger](trigger_command.md) command.


## Usage

```xml
. triggers :
    . trigger ~savegame_menu_trigger, event keyup, key ESCAPE, function savegames
    . trigger ~next_by_key_trigger, event keyup, key RIGHT_ARROW, special next
--
```


## Attributes

 * **name/~[trigger_name]:** The trigger's internal name.
 * **event:** The event to which the trigger will respond:
   * "keydown": Fired when the player presses a key down.
   * "keyup": Firef when the player releases a pressed key.
 * **key:** (Only on events "keyup" and "keydown") The key which to bind the action to.
   See [key](key_attribute.md) for supported keys.
 * **special:** A special action to perform.
   * "next": The advancement action which continues the story when it is on hold, e.g. on lines.
 * **function:** A function to perform. See [[language:functions|functions]] for all available functions.


## Parents

 * [triggers](triggers.md)


## Children

 * none


## Related commands

 * [trigger](trigger_command.md)
