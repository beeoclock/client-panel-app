/*-----------------------------------------------
|   DomNode
-----------------------------------------------*/
export class DomNode {
  constructor(
    public node: any
  ) {
  }

  addClass(className: string) {
    this.isValidNode() && this.node.classList.add(className);
  }

  removeClass(className: string) {
    this.isValidNode() && this.node.classList.remove(className);
  }

  toggleClass(className: string) {
    this.isValidNode() && this.node.classList.toggle(className);
  }

  hasClass(className: string) {
    this.isValidNode() && this.node.classList.contains(className);
  }

  data(key: string) {
    if (this.isValidNode()) {
      try {
        return JSON.parse(this.node.dataset[this.camelize(key)]);
      } catch (e) {
        return this.node.dataset[this.camelize(key)];
      }
    }
    return null;
  }

  attr(name: string) {
    return this.isValidNode() && this.node[name];
  }

  setAttribute(name: string, value: string) {
    this.isValidNode() && this.node.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.isValidNode() && this.node.removeAttribute(name);
  }

  setProp(name: string, value: string) {
    this.isValidNode() && (this.node[name] = value);
  }

  on(event: string, cb: any) {
    this.isValidNode() && this.node.addEventListener(event, cb);
  }

  isValidNode() {
    return !!this.node;
  }

  // eslint-disable-next-line class-methods-use-this
  camelize(str: string) {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`;
  }
}

