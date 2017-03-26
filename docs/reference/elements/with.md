
# [command] with

Executes different contained commands depending on a variable's value. It is similar to
"switch" in popular programming languages like C++.


## Usage

```xml
. with var state :
    . when is first :
        (( c: It was his first time visiting the shop. ))
    --
    . when is second :
        (( c: It was his second time visiting the shop. ))
    --
    . else :
        (( c: He had visited the shop many times in the past. ))
    --
--
```


## Attributes

 * **var:** The name of the variable for which the value should be checked.


## Parents

 * [scene](scene.md)
 * [while](while.md)


## Children

 * [`when`](when.md)
 * [else](else.md)
