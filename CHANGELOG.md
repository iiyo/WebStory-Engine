# WebStory Engine Changelog

## Version 2017.x

### Version 2017.1.1

 * Fix italic text (GitHub issue [#28](https://github.com/iiyo/WebStory-Engine/issues/28))
 * Fix shake effect (GitHub issue [#29](https://github.com/iiyo/WebStory-Engine/issues/29))
 * `yes` and `true` are now both considered truthy attribute values and can be used interchangeably
 * Fix wrong attribute values in audio tests

### Version 2017.1

 * Allow custom data sources (GitHub issue #27)
 * Default textbox style changed
 * Remove browserify2using, use usingify
 * Change changelog file to markdown format
 * Update ESLint config
 * Remove MO5.Dict dependency, use string-dict
 * Use easy-ajax instead of MO5.ajax
 * Remove MO5.dom.Element dependency, use class-manipulator
 * Add enjoy-core to the dependencies
 * Remove loops, use functions instead
 * Savegame feature now refactored into its own module
 * Remove attachEventListener (because we don't support legacy browsers)
 * Add a createElement module for easier DOM element creation

## Version 2016.x

### Version 2016.7.1

 * Unified creation of displayable assets.
 * Fixed blurry fonts and images during the reveal effect.
 * Removed move.js dependency.

### Version 2016.7

 * Added a **composite asset** which is meant to replace the imagepack asset. Instead of showing just one image at a time, it can display an arbitrary number of images at a time depending on which of its tags are activated.
 * Changed the implementation of the **reveal/typewriter effect**: It now uses CSS animations and uses opacity on the characters in place instead of adding characters to the textbox one after the other.
 * Added a **precompiler** to make games easier to write.

### Version 2015.12.1

 * UI commands can now have attributes with variables.
 * Added a `prefill` attribute to the prompt comannd. It sets a default value.

### Version 2015.11.1

 * WebStory code can now be embedded in the HTML so that the engine works without a server on local file systems. Take a look at the xml_embedded test for an example of this.
 * The loading screen can now be customized by adding a `loadingScreen` element to the `settings` section. It can contain an HTML template snippet with these variables: `{$all}`, `{$loaded}`, `{$remaining}` and `{$progress}`

### Version 2015.10.2

 * Default extensions didn't work with new module system (mainly side-images)
 * Added a test game for the side-images extension
 * Added head images for Cecile and Jack for testing

### Version 2015.10.1

 * Added a **while** command
 * Added **with** command
 * Added **set_vars** command
 * Variables can now be used in most attributes using the `{$var}` syntax
 * Options in **choice** now support inline commands
 * The **move** command now supports anchors for x and y
 * Added various tests / example games
 * Added full public domain sprite packs "Cecile" and "Jack"
 * Textboxes can now be styled differently for each speaker
 * WSE now uses MO5's module loader
 * Fixed various sound issues

### Version 0.4.x

### Version 0.4.0

 * Implemented anchors for displayable objects to be able to better position them on stage.
 * Fixed: When saving an imagepack that had no image set and then setting the same image that was set before loading resulted in the infamous "Trying to set an image that is already set" warning and so the image was never shown.

### Version 0.3.7

Released on 2013-11-01.

 * Fixed: wait command ignored duration= attribute.

### Version 0.3.6

Released on 2013-10-29.

 * Fixed: Textbox set new text before triggering the fade effect.

### Version 0.3.5

Released on 2013-10-29.

 * Added more options for variables.
 * Added a fadeDuration= attribute to Textboxes to control the duration of the fade effect between lines. Default is 0 now (no fade).

### Version 0.3.4

Released on 2013-10-18.

 * Fixed: When loading a savegame, some images on Imagepacks got stuck.

### Version 0.3.3

Released on 2013-10-12.

 * Fixed: When using the set command with duration 0, the duration was instead set to the default.

### Version 0.3.2

Released on 2013-08-10.

 * Fixed: When using a var command inside of a choice command, any ifvar or ifvalue attributes were ignored.

### Version 0.3.1

Released on 2013-08-04.

 * Fixed a bug with the savegame system: audio was not restored after loading a savegame. Also, when loading an asset fails the other assets are not affected by it. Savegames made with 0.3.0 should still work with this release.

### Version 0.3.0

 * Better support for %, e.g. to allow WebStories with fluid stage dimensions.
 * New Background asset that stretches to fit the stage.
 * Engine split into separate files for development to be more modular.
 * Alpha support for local container apps.
 * WSE object gets it's own data bus, to allow obtaining game and interpreter references at startup.
 * Textbox asset gets an HTML-aware typewriter effect.
 * Use HTML in `<line>` commands directly, without the ugy {tag} syntax.
 * New side images extension.
 * Updated savegame API to make it more robust and easier to use. Also fixes: [GitHub issue #4](https://github.com/jsteinbeck/WebStory-Engine/issues/4)
 * Extend the Textbox definition with a `<nameTemplate>` element, in which {name} will be replaced by the name of the character who's speaking, if any.
 * Rename attribute 'names' on Textbox definitions to 'namebox'. The old attribute name was much too confusing.

### 0.2.1 BETA

 * Fixed [issue 2](https://github.com/jsteinbeck/WebStory-Engine/issues/2)
 * Added missing easing attribute to hide command.

### 0.2.0 BETA

 *  Initial release