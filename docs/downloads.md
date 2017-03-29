
# Downloads

Want to get started with WebStory Engine? Just click the button below to download the most
recent version:

[Download WebStory Engine (v2017.1.1)](https://github.com/iiyo/WebStory-Engine/releases/download/v2017.1.1/WebStory-Engine-v2017.1.1.zip)


## What's new in 2017.1.1?

- Fix italic text (GitHub issue [#28](https://github.com/iiyo/WebStory-Engine/issues/28))
- Fix shake effect (GitHub issue [#29](https://github.com/iiyo/WebStory-Engine/issues/29))
- `yes` and `true` are now both considered truthy attribute values and can be used interchangeably
- Fix wrong attribute values in audio tests


## What's new in v2017.1?

This release comes with the following improvements:

- Custom data sources can now be used ([GitHub issue #27](https://github.com/iiyo/WebStory-Engine/issues/27))
- Default textbox style changed

It also changes some under-the-hood stuff:

- Remove browserify2using, use usingify
- Change changelog file to markdown format
- Update ESLint config
- Remove MO5.Dict dependency, use string-dict
- Use easy-ajax instead of MO5.ajax
- Remove MO5.dom.Element dependency, use class-manipulator
- Add enjoy-core to the dependencies
- Remove loops, use functions instead
- Savegame feature now refactored into its own module
- Remove attachEventListener (because we don't support legacy browsers)
- Add a createElement module for easier DOM element creation
