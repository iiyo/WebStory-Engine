
# List of WebStory Elements

 * [ws](elements/ws.md) - The root element

## settings

 * [settings](elements/settings.md)
 * [stage](elements/stage.md) - Defines the properties of the stage
 * [triggers](elements/triggers.md) - Defines the triggers to be used within the story
 * [trigger](elements/trigger.md) - Sets up a trigger, for example to bind an action to a keyboard event

## assets

 * [assets](elements/assets.md)
 * [animation](elements/animation.md)
  * [group](elements/group.md) - A group of commands for an animation
   * [do](elements/do.md) - A generic command for applying an action to an asset
   * [transform](elements/transform.md) - [Tweening](http://en.wikipedia.org/wiki/Inbetweening) command for an asset's [CSS](http://en.wikipedia.org/wiki/Cascading_Style_Sheets) style
 * [audio](elements/audio.md)
  * [track](elements/track.md) - An audio track
   * [source](elements/source.md) - A source file for an audio track
 * [background](elements/background.md)
 * [character](elements/character.md)
  * [displayname](elements/displayname.md) - The character's displayed name
 * [curtain](elements/curtain.md)
 * [imagepack](elements/imagepack.md)
  * [image](elements/image.md) - An image contained within an ImagePack
 * [textbox](elements/textbox.md)
  * [nameTemplate](elements/nameTemplate.md)
 * [composite](elements/composite.md)


## scenes

 * [scenes](elements/scenes.md)
 * [scene](elements/scene.md) - A scene containing various commands
  * [alert](elements/alert.md) - Pop-up UI dialog for informing the user about something
  * [break](elements/break.md) - Breaks the story's flow and waits for user action
  * [choice](elements/choice.md) - Displays a choice menu
   * [option](elements/option.md) - An option on a choice menu
    * [var](elements/var.md) - Defines a local variable. 
  * [clear](elements/clear.md) - Clears a textbox
  * [confirm](elements/confirm.md) - Pop-up UI dialog for a yes/no type question
  * [flash](elements/flash.md) - Flash effect for visible elements, changing the opacity once
  * [flicker](elements/flicker.md) - Flicker effect for visible elements, changing the opacity multiple times in a row
  * [fn](elements/fn.md) - Executes a function
  * [global](elements/global.md) - Sets a global variable
  * [globalize](elements/globalize.md) - Exports a local variable to the global scope
  * [goto](elements/goto.md) - Jumps to the beginning of another scene
  * [hide](elements/hide.md) - Hides a visible asset
  * [line](elements/line.md) - Displays text on textbox
  * [localize](elements/localize.md) - Imports a global variable into the local scope
  * [move](elements/move.md) - Moves a visible asset on the stage
  * [pause](elements/pause.md) - Pauses an audio track
  * [play](elements/play.md) - Plays an audio track
  * [prompt](elements/prompt.md) - Pop-up UI dialog for requesting user input
  * [restart](elements/restart.md) - Restarts the WebStory
  * [set](elements/set.md) - Sets an image on an ImagePack or a track on an Audio asset
  * [set_vars](elements/set_vars.md) - Sets the values of many variables at once
  * [show](elements/show.md) - Displays an asset on the stage
  * [start](elements/start.md) - Starts an animation
  * [stop](elements/stop.md) - Stops an Audio track or an animation
  * [sub](elements/sub.md) - Enters another scene, executes it and then returns to the current scene
  * [tag](elements/tag.md)
  * [trigger](elements/trigger_command.md) - Activates or deactivates a trigger
  * [var](elements/var.md) - Sets a local variable or performs an action on it
  * [wait](elements/wait.md) - Waits for a specified time or until all previous commands have been executed
  * [while](elements/while.md) - Loops a series of commands for as long as the condition is met
  * [with](elements/with.md) - Executes different commands depending on a variable's value
