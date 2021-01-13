/** @jsx h */

let isPreact = null;
if (window.preact) {
  isPreact = true;
} else if (window.React && window.ReactDOM) {
  isPreact = false;
} else {
  alert('unable to find window.preact or window.React && window.ReactDOM');
}

window.h = isPreact ? preact.createElement : React.createElement;
//window.renderToString = isPreact ? preactRenderToString : ReactDOMServer.renderToString;
window.renderToString = input => {
  const renderToString = isPreact ? preactRenderToString : ReactDOMServer.renderToString;
  const output = renderToString(input);
  return output.replace(` data-reactroot=""`, '');
};

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
    super();
    /*const host = this.attachShadow({mode: 'open'});
    const div = document.createElement('div');
    div.textContent = 'hello from MyCustomElement';
    host.appendChild(div);*/
  }

  get booleanPropWithSetter() { return this._booleanPropWithSetter; }
  set booleanPropWithSetter(newValue) { this._booleanPropWithSetter = newValue; }

  get stringPropWithSetter() { return this._stringPropWithSetter; }
  set stringPropWithSetter(newValue) { this._stringPropWithSetter = newValue; }

  get arrayPropWithSetter() { return this._arrayPropWithSetter; }
  set arrayPropWithSetter(newValue) { this._arrayPropWithSetter = newValue; }

  get objectPropWithSetter() { return this._objectPropWithSetter; }
  set objectPropWithSetter(newValue) { this._objectPropWithSetter = newValue; }
}
customElements.define('my-custom-element', MyCustomElement);

class ReactComponent extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <my-custom-element
          id="proptypesandsetters"
          booleanPropWithSetter={true}
          stringPropWithSetter="string"
          arrayPropWithSetter={['one', 'two']}
          objectPropWithSetter={{property:'value'}}
          booleanPropWithoutSetter={true}
          stringPropWithoutSetter="string"
          arrayPropWithoutSetter={['one', 'two']}
          objectPropWithoutSetter={{property:'value'}}
        />
        <my-custom-element
          id="ceclassname"
          className="className"
        />
        <my-custom-element
          id="ceclass"
          class="class"
        />
        <my-custom-element
          id="ceevents"
          onstringprop="string"
          onbubbling={() => document.getElementById('ceevents').onbubblingfired = true}
          onnobubbling={() => document.getElementById('ceevents').onnobubblingfired = true}
          oncustomCapture={() => document.getElementById('ceevents').oncustomcapturefired = true}
          onClick={() => document.getElementById('ceevents').onclickfired = true}
        >
          <div id="ceeventschild"/>
        </my-custom-element>
      </div>
    );
  }
};

const rootComponent = <ReactComponent />;
const root = document.createElement('div');
document.body.appendChild(root);
if (!isPreact) {
  ReactDOM.render(rootComponent, root);
} else if (window.preact) {
  preact.render(rootComponent, root);
}

const style = document.createElement('style');
document.head.appendChild(style);
style.textContent = `
h4 {
  /*margin: 0;*/
  margin-bottom: 0;
}
.code {
  background-color: lightgray;
  white-space: pre;
  font-family: monospace;
  display: inline-block;
}
/*.flex-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.flex-container > div {
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid black;
  width: 100px;
}*/
`;

const flexContainer = document.createElement('div');
flexContainer.classList.add('flex-container');
document.body.appendChild(flexContainer);

// does assigning a jsx attribute without a property setter in the custom element set an attribute? what does it do for each variable type?
const proptypesandsetters = document.getElementById('proptypesandsetters');

['booleanPropWithSetter',
  'stringPropWithSetter',
  'arrayPropWithSetter',
  'objectPropWithSetter',
  'booleanPropWithoutSetter',
  'stringPropWithoutSetter',
  'arrayPropWithoutSetter',
  'objectPropWithoutSetter'].forEach(prop => {
    const div = document.createElement('div');
    flexContainer.appendChild(div);

    div.insertAdjacentHTML('beforeend',
      `<h4>${prop}</h4>`);

    const propStr = JSON.stringify(proptypesandsetters[prop]);
    div.insertAdjacentHTML('beforeend',
      `<div>prop: <span class=code>${propStr}</span></div>`);

    const attr = JSON.stringify(proptypesandsetters.getAttribute(prop));
    div.insertAdjacentHTML('beforeend',
      `<div>attr: <span class=code>${attr}</span></div>`);
});

[{id: 'ceclassname', title: 'className prop'},
  {id: 'ceclass', title: 'class prop'}].forEach(({id, title}) => {
    const element = document.getElementById(id);
    const div = document.createElement('div');
    flexContainer.appendChild(div);

    div.insertAdjacentHTML('beforeend',
      `<h4>${title}</h4>`);

    const classNameProp = JSON.stringify(element['className']);
    const classNameAttr = JSON.stringify(element.getAttribute('className'));
    div.insertAdjacentHTML('beforeend',
      `<div>className prop: <span class=code>${classNameProp}</span></div>`);
    div.insertAdjacentHTML('beforeend',
      `<div>className attr: <span class=code>${classNameAttr}</span></div>`);

    const classProp = JSON.stringify(element['class']);
    const classAttr = JSON.stringify(element.getAttribute('class'));
    div.insertAdjacentHTML('beforeend',
      `<div>class prop: <span class=code>${classProp}</span></div>`);
    div.insertAdjacentHTML('beforeend',
      `<div>class attr: <span class=code>${classAttr}</span></div>`);
});

// what happens with bubbling events?

const ceevents = document.getElementById('ceevents');

{
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>onstringprop</h4>`);

  const onstringprop = JSON.stringify(ceevents['onstringprop']);
  div.insertAdjacentHTML('beforeend',
    `<div>onstringprop prop: <span class=code>${onstringprop}</span></div>`);
  const onstringattr = JSON.stringify(ceevents.getAttribute('onstringprop'));
  div.insertAdjacentHTML('beforeend',
    `<div>onstringprop attr: <span class=code>${onstringattr}</span></div>`);

  const stringprop = JSON.stringify(ceevents['stringprop']);
  div.insertAdjacentHTML('beforeend',
    `<div>stringprop prop: <span class=code>${stringprop}</span></div>`);
  const stringattr = JSON.stringify(ceevents.getAttribute('stringprop'));
  div.insertAdjacentHTML('beforeend',
    `<div>stringprop attr: <span class=code>${stringattr}</span></div>`);
}

{
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>event handler for bubbling event</h4>`);

  ceevents.onbubblingfired = false;
  ceevents.dispatchEvent(new Event('bubbling', {bubbles: true}));
  div.insertAdjacentHTML('beforeend',
    `<div>event handler called: <span class=code>${ceevents.onbubblingfired}</span></div>`);
}

{
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>event handler for non-bubbling event</h4>`);

  ceevents.onnobubblingfired = false;
  ceevents.dispatchEvent(new Event('nobubbling', {bubbles: false}));
  div.insertAdjacentHTML('beforeend',
    `<div>event handler called: <span class=code>${ceevents.onnobubblingfired}</span></div>`);
}

const ceeventschild = document.getElementById('ceeventschild');
{
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>event handler for capture event</h4>`);

  ceevents.oncustomcapturefired = false;
  ceeventschild.dispatchEvent(new Event('custom', {bubbles: false}));
  div.insertAdjacentHTML('beforeend',
    `<div>event handler called during capture: <span class=code>${ceevents.oncustomcapturefired}</span></div>`);
}

{
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>event handler for click event</h4>`);

  ceevents.onclickfired = false;
  ceevents.click();
  div.insertAdjacentHTML('beforeend',
    `<div>event handler called: <span class=code>${ceevents.onclickfired}</span></div>`);
}

function addRenderToStringTest(title, inputStr, inputJsx) {
  const div = document.createElement('div');
  flexContainer.appendChild(div);

  div.insertAdjacentHTML('beforeend',
    `<h4>${title}</h4`);

  const inputDiv = document.createElement('div');
  div.appendChild(inputDiv);
  inputDiv.textContent = 'input: ';
  const inputSpan = document.createElement('span');
  inputDiv.appendChild(inputSpan);
  inputSpan.classList.add('code');
  inputSpan.textContent = inputStr;

  const outputDiv = document.createElement('div');
  div.appendChild(outputDiv);
  outputDiv.textContent = 'output: ';
  const outputSpan = document.createElement('span');
  outputDiv.appendChild(outputSpan);
  outputSpan.classList.add('code');
  outputSpan.textContent = renderToString(inputJsx);
}

addRenderToStringTest('renderToString htmlFor custom element',
  `<my-custom-element htmlFor="foo" />`,
  <my-custom-element htmlFor="foo" />);

addRenderToStringTest('renderToString htmlFor div',
  `<div htmlFor="foo" />`,
  <div htmlFor="foo" />);

addRenderToStringTest('renderToString for custom element',
  `<my-custom-element for="foo" />`,
  <my-custom-element for="foo" />);

addRenderToStringTest('renderToString for div',
  `<div for="foo" />`,
  <div for="foo" />);

addRenderToStringTest('renderToString className custom element',
  `<my-custom-element className="foo" />`,
  <my-custom-element className="foo" />);

addRenderToStringTest('renderToString className div',
  `<div className="foo" />`,
  <div className="foo" />);

addRenderToStringTest('renderToString class custom element',
  `<my-custom-element class="foo" />`,
  <my-custom-element class="foo" />);

addRenderToStringTest('renderToString class div',
  `<div class="foo" />`,
  <div class="foo" />);

addRenderToStringTest('renderToString boolean custom element',
  `<my-custom-element attr={true} />`,
  <my-custom-element attr={true} />);

addRenderToStringTest('renderToString boolean div',
  `<div attr={true} />`,
  <div attr={true} />);

addRenderToStringTest('renderToString array custom element',
  `<my-custom-element attr={['one', 'two']} />`,
  <my-custom-element attr={['one', 'two']} />);

addRenderToStringTest('renderToString array div',
  `<div attr={['one', 'two']} />`,
  <div attr={['one', 'two']} />);

addRenderToStringTest('renderToString object custom element',
  `<my-custom-element attr={{property: 'value'}} />`,
  <my-custom-element attr={{property: 'value'}} />);

addRenderToStringTest('renderToString object div',
  `<div attr={{property: 'value'}} />`,
  <div attr={{property: 'value'}} />);

addRenderToStringTest('renderToString onClick custom element',
  `<my-custom-element onClick="foo" />`,
  <my-custom-element onClick="foo" />);

addRenderToStringTest('renderToString onClick div',
  `<div onClick="foo" />`,
  <div onClick="foo" />);

addRenderToStringTest('renderToString onClick fn custom element',
  `<my-custom-element onClick={() => console.log('foo')} />`,
  <my-custom-element onClick={() => console.log('foo')} />);

addRenderToStringTest('renderToString onClick fn div',
  `<div onClick={() => console.log('foo')} />`,
  <div onClick={() => console.log('foo')} />);

addRenderToStringTest('renderToString onCustomEvent custom element',
  `<my-custom-element onCustomEvent="foo" />`,
  <my-custom-element onCustomEvent="foo" />);

addRenderToStringTest('renderToString onCustomEvent div',
  `<div onCustomEvent="foo" />`,
  <div onCustomEvent="foo" />);

addRenderToStringTest('renderToString onCustomEvent fn custom element',
  `<my-custom-element onCustomEvent={() => console.log('foo')} />`,
  <my-custom-element onCustomEvent={() => console.log('foo')} />);

addRenderToStringTest('renderToString onCustomEvent fn div',
  `<div onCustomEvent="foo" />`,
  <div onCustomEvent="foo" />);
