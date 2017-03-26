# [command] trigger

Command to activate or disable a trigger. Not to be confused with the [trigger](trigger.md)
element in [settings](settings.md).


## Usage

```xml
. trigger ~next_on_right, action activate
<!-- ... -->
. trigger ~next_on_right, action deactivate
```


## Attributes

 * **name/~[trigger_name]:** The trigger's internal name.
 * **action:** The action to perform:
   * "activate" to activate the trigger.
   * "deactivate" to disable the trigger.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)


## Parents

 * [scene](scene.md)


## Children

 * none


## Related elements

 * [trigger](trigger.md) (in settings section)
 