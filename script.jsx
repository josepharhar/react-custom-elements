/** @jsx h */

let isPreact = null;
if (window.preact) {
  isPreact = true;
} else if (window.React && window.ReactDOM) {
  isPreact = false;
} else {
  alert('unable to find window.preact or window.React && window.ReactDOM');
}

window.h = isPreact ? preact.createElement : react.createElement;

let Component;
if (window.React) {
  Component = React.Component;
} else if (window.preact) {
  Component = preact.Component;
} else {
  alert('React and preact not found');
}

class MyCustomElement extends HTMLElement {
  constructor() {
    console.log('MyCustomElement constructor');
    super();
    const host = this.attachShadow({mode: 'open'});
    const div = document.createElement('div');
    div.textContent = 'hello from MyCustomElement';
    host.appendChild(div);
  }

  get asdf() {
    console.log('get asdf');
    return 'asdf';
  }
  set asdf(newValue) {
    console.log('set asdf: ' + newValue);
  }

  get array() {
    console.log('get array');
    return [];
  }
  set array(newValue) {
    console.log('set array: ' + JSON.stringify(newValue));
  }
  
  get obj() {
    console.log('get obj');
    return {};
  }
  set obj(newValue) {
    console.log('set obj: ' + JSON.stringify(newValue));
  }
}
customElements.define('my-custom-element', MyCustomElement);

class ReactComponent extends Component {
  constructor() {
    super();
    console.log('hello from ReactComponent constructor');
  }
  render() {
    return (
      <div>
        <div>hello from ReactComponent</div>
        <my-custom-element
          className="asdf"
          asdf="rofl"
          array={['one', 'two']}
          obj={{prop: 'value'}}
          nosetter="nosetter"
          onClick={() => console.log('onclick handler')}
          onasdf={() => console.log('asdf event')}
          onrofl="lol"
        />
      </div>
    );
  }
};

const rootComponent = <ReactComponent />;
const root = document.createElement('div');
document.body.appendChild(root);
if (window.ReactDOM) {
  ReactDOM.render(rootComponent, root);
} else if (window.preact) {
  preact.render(rootComponent, root);
} else {
  alert('ReactDOM and preact not found');
}
