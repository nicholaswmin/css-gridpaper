export default class CSSGridpaper extends HTMLElement {
  constructor() {
    super()
    this.elem = document.body
    this.lastGrid = null
  }
  
  connectedCallback() {
    if (this.hasAttribute('manual'))
      return

      this.validateNumericCSSProps(
        this.getAttribute('size-prop'), 
        this.getAttribute('scale-prop')
      )

    this.onEvents(
      this.extractEventNamesFromAttr(this.getAttribute('on-events')),
      this.draw.bind(this, undefined))

    this.draw()
  }

  get(name) {
    return +getComputedStyle(document.body)
      .getPropertyValue(name).replace(/[^.\d]/g, '')
  }
  
  onEvents(names = ['input', 'change'], fn) {
    names.forEach(evt => window.addEventListener(evt, fn))
  }
  
  validateNumericCSSProps(...props) {
    const throwErr = p => { throw TypeError(`${p} is not a numeric CSS prop.`) }
    const invalid = p => !this.get(p) || isNaN(this.get(p))

    props.filter(invalid).forEach(throwErr)
  }
  
  createStyles(css) {
    const style = document.createElement('style')
    style.textContent = css
    
    return style
  }
  
  size() {
    const size = this.get(this.getAttribute('size-prop'))
    const scale = this.get(this.getAttribute('scale-prop'))

    return (size || this.get('font-size')) * scale
  }
  
  draw(size = this.size()) {
    const elem = document.body
    const rgba = this.getAttribute('color') || 'rgba(0, 119, 179, 0.4)'
    const grad = `linear-gradient(${rgba} 1px, transparent 1px) left top`
    
    elem.style.background = `${grad} / ${size}px ${size}px`
    
    return this
  }
  
  extractEventNamesFromAttr(str) {
    str ? str.split(',')
      .map(event => event.trim())
      .filter(event => !!event.length)
    : []
  }
  
  clear() {
    this.elem.style.background = 'none'
  }
}
