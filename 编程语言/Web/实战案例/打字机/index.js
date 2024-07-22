class TypeWriter {
  constructor({ el, texts, typingSpeed = 100, eraseSpeed = 20, eraseDelay = 2000, blinkSpace = 5, rem = 1 }) {
    this.el = el;
    this.texts = texts;
    this.count = 0;
    this.index = 0;
    this.currentText = "";
    this.letter = "";
    this.typingSpeed = typingSpeed;
    this.eraseSpeed = eraseSpeed;
    this.eraseDelay = eraseDelay;
    this.blinkSpace = blinkSpace;
    this.rem = rem;
    this.typeTimer = null;
    this.eraseTimer = null;

    this.dom = document.getElementById(this.el);
  }

  get offsetHeight() {
    return this._offsetHeight;
  }

  set offsetHeight(value) {
    this._offsetHeight = value;
  }

  get offsetWidth() {
    return this._offsetWidth;
  }

  set offsetWidth(value) {
    this._offsetWidth = value;
  }

  on(eventName, handler) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(handler);
  }

  trigger(eventName, ...args) {
    const handlers = this.listeners[eventName];
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  type() {
    this.currentText = this.texts[this.count];
    this.letter = this.currentText.slice(0, ++this.index);
    this.displayLetter();

    if (this.letter.length === this.currentText.length) {
      setTimeout(() => this.erase(), this.eraseDelay);
    } else {
      setTimeout(() => this.type(), this.typingSpeed);
    }
  }

  erase() {
    this.letter = this.currentText.slice(0, --this.index);
    this.displayLetter();

    if (this.letter.length === 0) {
      this.index = 0;
      this.count = (this.count + 1) % this.texts.length;
      this.clearDisplay();
      setTimeout(() => this.type(), 500);
    } else {
      setTimeout(() => this.erase(), this.eraseSpeed);
    }
  }

  displayLetter() {
    if (this.dom) {
      this.dom.textContent = this.letter;
      this.dom.style.width = `${this.getTextWidth(this.letter)}px`;
    }
  }

  clearDisplay() {
    if (this.dom) {
      this.dom.textContent = "";
    }
  }

  getTextWidth(text) {
    const span = document.createElement("span");
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    span.style.fontSize = `${this.rem * rootFontSize}px`;
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "nowrap";
    span.textContent = text;
    document.body.appendChild(span);
    this.offsetHeight = span.offsetHeight;
    this.offsetWidth = span.offsetWidth;
    // this.trigger("span", this.offsetHeight, this.offsetWidth);
    document.body.removeChild(span);
    return this.offsetWidth + this.blinkSpace;
  }

  clearTimers() {
    if (this.typeTimer) {
      clearTimeout(this.typeTimer);
    }
    if (this.eraseTimer) {
      clearTimeout(this.eraseTimer);
    }
  }
}
