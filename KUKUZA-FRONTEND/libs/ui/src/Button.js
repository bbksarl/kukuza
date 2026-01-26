// Simple web component button (example)
class KzButton extends HTMLElement {
  constructor(){
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const btn = document.createElement('button');
    btn.innerText = this.getAttribute('label') || 'Button';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '8px';
    shadow.appendChild(btn);
  }
}

customElements.define('kz-button', KzButton);
