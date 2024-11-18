[![tests:unit](https://github.com/nicholaswmin/css-gridpaper/actions/workflows/tests:unit.yml/badge.svg)](https://github.com/nicholaswmin/css-gridpaper/actions/workflows/tests:unit.yml)

`<css-gridpaper>`

Draws the exact same grid as [Gridlover][gridlover], the 
modular-scale/vertical-rhythm design tool.

I use it to debug vertical-rhythm formulas; 
That design tool is used as the reference implementation so its 
supposed to be a pixel-perfect match between the 2.

It (might) also [redraw automatically](#redrawing-the-grid), 
depending on use-case.

## install

```bash
npm i https://github.com/nicholaswmin/css-gridpaper.git
```

### quickstart

It's a native [WebComponent][wc] with 0 dependencies.

So, assuming you have an `.html` doc:

```html
<script type="module"> import 'css-gridpaper' </script>

<style>
  :root {
    --base-size: 16px;
    --line-height: 1.5
  }

  body { 
    font-size: var(--base-size); 
    line-height: var(--line-height);
  }
</style>

<css-gridpaper 
  size-prop="--base-size" 
  scale-prop="--line-height"
  color="rgba(0, 120, 180, 0.2)">
</css-gridpaper>

<!-- Rest of your HTML -->
```
> note: The DOM position doesn't matter. 

Trigger a redraw grid if you update the CSS variables:

> **note:** you might [not need this](#redrawing-the-grid).

```js
// set --base-size to: 20
document.documentElement.style.setProperty('--base-size', 20)

// redraw grid to new variables
document.querySelector('css-gridpaper').draw()
```

There's 2 ways to draw the grid:

1. Using [CSS variables][css-custom].
    This is what Gridlover does & what's reasonable to be doing because it 
    adapts to `font-size` and `line-height`. 
    Read below for more.
2. [Manual redraw](#manual-redraw), using `element.draw(size)`. 
    Almost pointless but it's there.

## setting up CSS variables

The grid size is calculated via 2 [CSS variables][css-custom].
It expects that you've defined them in a `.css` somewhere:

- a `size` property, type numeric.
- a `scale` property, type numeric. 

The name is configurable, so `size` can be i.e: `--base-size: 10`. 

The grid is drawn as `size * scale`.

Here's my example:

```css
: root {
    --base-size: 20; /* my size prop */
    --line-height: 1.5 /* my scale prop */
}
```

... `<css-gridpaper>` is defined in your HTML as:

```html
<style>
  :root {
    --base-size: 30;
    --line-height: 1.5
  }
</style>

<p> More HTML elements ... </p>

<css-gridpaper 
    size-prop="--base-size" 
    scale-prop="--line-height"
    color="rgba(0, 119, 179, 0.4)">
</css-gridpaper>

<script type="module"> import 'css-gridpaper' </script>
```
... this draws a grid of `30px` vertical intervals, 
as the `background` of `document.body`.

> Yes, thats a side-effect but nobody cares. 
> It's hassle-free and precise.  
>
> That's exactly what Gridlover does anyway.


### redrawing the grid

A grid that doesn't adapt to the `font-size` or `line-height` isn't helpful.  
You (most probably) need to redraw the grid when these values change.

The element listens for `change` and `input` events on `window`,
which triggers a redraw.

It assumes you used some kind of input i.e `<input type=range>"` to tweak some 
values, hence why that event bubbled up to `window`. 

I use sliders to tweak my layouts or formulas and this assumption 
makes for 0-hassle setups.

If you do something similar, the grid redraw would work out-the-box 
for you too. You can specify the events it listens or at the worst-case,
trigger a redraw manually.

### manual redraw

The following API redraws manually.

- `element.draw()` triggers a redraw using the CSS variables.
- `element.draw(50)` triggers a redraw with an explicit value.
  You can skip declaring CSS variables in this case but you must
  declare `manual` as an attribute, as shown below:

```html
<css-gridpaper manual></css-gridpaper>

<script type="module"> 
  import 'css-gridpaper'

  // draw a 30px grid
  document.querySelector('css-gridpaper').draw(30)
</script>
```

### listen for specific events

Declare a comma-separated list of event names on the `on-events` attribute, 
which *overrides* the events its listening for. 

Or disable entirely by passing an empty string.

In the example below, the button is not connected to the element at all. 
Clicking the button fires `click` events, it's a button after all and the 
click events bubble up on `window` where our elements picks it up and redraws.

```html
<button>Redraw</button>

<css-gridpaper 
  on-events="click,input"
  size-prop="--base-size" 
  scale-prop="--line-height"
  color="rgba(0, 119, 179, 0.4)">
</css-gridpaper>

<script type="module">
  import 'css-gridpaper'
<script>
```

> Note: Unless the CSS variables `size` or `scale` have changed, 
you won't notice anything since it redraws the same grid. duh.

Actually I lied, you don't even need a `button`. 
Just click with your mouse anywhere, it still works.

## gotchas

The attributes don't update after 1st initialisation.

I don't need it so I didnt bother but if you do, 
PRs are always welcome.

## test 

```bash
npm i 
node --run test
```

## serve for dev. 

```bash
node --run start
```

## authors

[@nicholaswmin][nicholaswmin]

## license 

> Copyright 2024
>
> Nicholas Kyriakides, @nicholaswmin
> The MIT License
>
> Permission is hereby granted, free of charge, to any person obtaining a copy 
> of this software and associated documentation files (the “Software”), to deal 
> in the Software without restriction, including without limitation the rights 
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
> copies of the Software, and to permit persons to whom the Software is 
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all 
> copies or substantial portions of the Software.


[gridlover]: https://gridlover.net
[nicholaswmin]: https://github.com/nicholaswmin
[wc]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
[css-custom]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
