class CSSOM {
  constructor(element = "") {
    if (typeof element === "object" && element?.constructor?.name) {
      this.element = element;
      this._defaultCSS();
    } else console.error("Enter document element");
  }

  _defaultCSS() {
    let tem_node = document.createElement(
      this.element.nodeName.toLowerCase()
    );
    document.body.appendChild(tem_node);
    let css = window.getComputedStyle(tem_node);

    const result = {};
    for (let x in css) {
      if (!isNaN(x)) {
        result[css[x]] = css.getPropertyValue(css[x]);
      }
    }
    this.defaultCSS = result;
    tem_node.remove();
  }

  _diffCSS(option = "") {
    let css = window.getComputedStyle(this.element, option);
    const result = {};
    for (let x in css) {
      if (
        !isNaN(x) &&
        css.getPropertyValue(css[x]) !== this.defaultCSS[css[x]]
      ) {
        result[css[x]] = css.getPropertyValue(css[x]);
      }
    }
    return result;
  }

  get _result() {
    let css = "";
    let __s = this._diffCSS();
    for (let x in __s) {
      css += x + ": " + __s[x] + "; ";
    }
    let elementName = this.element.nodeName.toLowerCase();
    if (elementName === "script") return { css: "", html: "" };
    let child = "";
    let nodes = this.element.childNodes;
    let node = new Date().getTime();
    let style = this._css(node, this.element);
    for (let x = 0; x < nodes.length; x++) {
      if (nodes[x].nodeName[0] == "#") {
        child += nodes[x].nodeValue;
        continue;
      }

      const { html, css } = new CSSOM(nodes[x])._result;
      child += html;
      style += css;
    }

    return {
      html: `<${elementName} class="node-${node}" style='${css}'>${child}<${elementName}/>`,
      css: style,
    };
  }

  __diffCSS(x, element) {
    let tem_node = document.createElement(
      this.element.nodeName.toLowerCase()
    );
    document.body.appendChild(tem_node);

    let old_css = window.getComputedStyle(tem_node, x);
    let new_css = window.getComputedStyle(element, x);
    let el_css = this._diffCSS();
    const result = {};
    for (let x in new_css) {
      if (
        !isNaN(x) &&
        new_css.getPropertyValue(new_css[x]) !==
          old_css.getPropertyValue(old_css[x]) &&
        new_css.getPropertyValue(new_css[x]) !== el_css[new_css[x]]
      ) {
        result[new_css[x]] = new_css.getPropertyValue(new_css[x]);
      }
    }
    tem_node.remove();
    return result;
  }

  _css(node, element) {
    let option = [":hover", ":active", ":focus", ":after", ":before"];
    let style = "";
    for (let x of option) {
      let _style = "";
      let __s = this.__diffCSS(x, element);
      for (let x in __s) {
        _style += x + ": " + __s[x] + "; ";
      }
      if (_style !== "") style += "node-" + node + x + _style;
    }
    return style;
  }

  get css() {
    const { html, css } = this._result;
    return `<style>${css}</style>${html}`;
  }
}

export default CSSOM;
