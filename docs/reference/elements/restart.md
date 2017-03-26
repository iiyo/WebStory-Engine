
# [command] restart

Command that restarts the game. The following will be reset while restarting:

 * Local variables, see [var](var.md)
 * The text log
 * The log of visited scenes
 * The start time of the game (used in savegames)
 * The contents of the stage
 * All assets will be deleted and then rebuild according to the [assets](assets.md) section.

Please note: commands that are written after an unconditional restart command will never be executed.

## Usage

    . restart

## Attributes

 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none
