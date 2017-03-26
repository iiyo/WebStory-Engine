
# [element] option

One option button on a choice menu. It can be associated with a scene, which will make
the engine go to that scene, or it can contain zero ore more [var](var.md) commands.

## Usage

See [choice](choice.md) for usage example.

## Attributes

| Name      | Shortcut | Description                                           |
|:---------:|:--------:|:------------------------------------------------------|
| label     |          | The text on the button.                               |
| scene     |          | If set, clicking on the button will go to this scene. |
| ifvar     |          | See [conditionals](conditionals.md)                 |
| ifvalue   |          | See [conditionals](conditionals.md)                 |
| ifnot     |          | See [conditionals](conditionals.md)                 |


## Parents

 * [choice](choice.md)

## Children

 * [var](var.md)
