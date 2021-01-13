/** @jsx h */

const style = document.createElement('style');
document.body.appendChild(style);
style.textContent = `
table, td {
  border: 1px solid #333;
}
thead, tfoot {
  background-color: #333;
  color: #fff;
}
.code {
  background-color: lightgray;
  white-space: pre;
  font-family: monospace;
}
`;

const table = document.createElement('table');
document.body.appendChild(table);
table.insertAdjacentHTML('beforeend',
  `<thead><tr><td></td><td>React</td><td>React Patched</td><td>Preact</td>`);
const tbody = document.createElement('tbody');
table.appendChild(tbody);

class MyCustomElement extends HTMLElement {
  constructor() {
    super();
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

const reactStableRoot = document.createElement('div');
const reactPatchedRoot = document.createElement('div');
const preactRoot = document.createElement('div');

/*class ReactComponent extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
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
  margin-bottom: 0;
}
.code {
  background-color: lightgray;
  white-space: pre;
  font-family: monospace;
  display: inline-block;
}
`;

const flexContainer = document.createElement('div');
flexContainer.classList.add('flex-container');
document.body.appendChild(flexContainer);

// does assigning a jsx attribute without a property setter in the custom element set an attribute? what does it do for each variable type?
const proptypesandsetters = document.getElementById('proptypesandsetters');*/

function renderAllFrameworks(jsxfn) {
  const str = jsxfn.toString().replace('function () {', '').replace(/}$/, '');

  window.h = ReactStable.createElement;
  const reactStable = document.createElement('div');
  ReactDOMStable.render(eval(str), reactStable);

  window.h = ReactPatched.createElement;
  const reactPatched = document.createElement('div');
  ReactDOMPatched.render(eval(str), reactPatched);

  window.h = preact.createElement;
  const preactDiv = document.createElement('div');
  preact.render(eval(str), preactDiv);

  window.h = undefined;

  return [
    reactStable.querySelector('my-custom-element'),
    reactPatched.querySelector('my-custom-element'),
    preactDiv.querySelector('my-custom-element')
  ];
}

{
  const [stable, patched, preact] = renderAllFrameworks(
    function() {<my-custom-element
      booleanPropWithSetter={true}
      stringPropWithSetter="string"
      arrayPropWithSetter={['one', 'two']}
      objectPropWithSetter={{property:'value'}}
      booleanPropWithoutSetter={true}
      stringPropWithoutSetter="string"
      arrayPropWithoutSetter={['one', 'two']}
      objectPropWithoutSetter={{property:'value'}}
    />});

  ['booleanPropWithSetter',
    'stringPropWithSetter',
    'arrayPropWithSetter',
    'objectPropWithSetter',
    'booleanPropWithoutSetter',
    'stringPropWithoutSetter',
    'arrayPropWithoutSetter',
    'objectPropWithoutSetter'].forEach(prop => {
      tbody.insertAdjacentHTML('beforeend',
        `<tr>
          <td>${prop} - property</td>
          <td class=code>${JSON.stringify(stable[prop])}</td>
          <td class=code>${JSON.stringify(patched[prop])}</td>
          <td class=code>${JSON.stringify(preact[prop])}</td>
        </tr>
        <tr>
          <td>${prop} - attribute</td>
          <td class=code>${JSON.stringify(stable.getAttribute(prop))}</td>
          <td class=code>${JSON.stringify(patched.getAttribute(prop))}</td>
          <td class=code>${JSON.stringify(preact.getAttribute(prop))}</td>
        </tr>`);
  });
}

function renderPropertyAndAttribute(title, property, stable, patched, preact) {
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>${title} - ${property} property</td>
      <td class=code>${JSON.stringify(stable[property])}</td>
      <td class=code>${JSON.stringify(patched[property])}</td>
      <td class=code>${JSON.stringify(preact[property])}</td>
    </tr>
    <tr>
      <td>${title} - ${property} attribute</td>
      <td class=code>${JSON.stringify(stable.getAttribute(property))}</td>
      <td class=code>${JSON.stringify(patched.getAttribute(property))}</td>
      <td class=code>${JSON.stringify(preact.getAttribute(property))}</td>
    </tr>`);
}

{
  const [stable, patched, preact] = renderAllFrameworks(
    function(){<my-custom-element className="foo" />});
  renderPropertyAndAttribute('className="foo"', 'className', stable, patched, preact);
  renderPropertyAndAttribute('className="foo"', 'class', stable, patched, preact);
}
{
  const [stable, patched, preact] = renderAllFrameworks(
    function(){<my-custom-element class="foo" />});
  renderPropertyAndAttribute('class="foo"', 'className', stable, patched, preact);
  renderPropertyAndAttribute('class="foo"', 'class', stable, patched, preact);
}
{
  const [stable, patched, preact] = renderAllFrameworks(
    function(){<my-custom-element htmlFor="foo" />});
  renderPropertyAndAttribute('htmlFor="foo"', 'htmlFor', stable, patched, preact);
  renderPropertyAndAttribute('htmlFor="foo"', 'for', stable, patched, preact);
}

{

  <my-custom-element
    onbubbling={event => event.target.onbubblingfired = true}
    onnobubbling={event => event.target.onnobubblingfired = true}
    oncustomCapture={event => event.target.oncustomcapturefired = true}
    onClick={event => event.target.onclickfired = true}
  ><div /></my-custom-element>
}

// what happens with bubbling events?

/*const ceevents = document.getElementById('ceevents');

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
  <div onCustomEvent="foo" />);*/
