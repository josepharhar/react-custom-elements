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
.code, tbody > tr > td:not(:first-child) {
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

function jsxRemoveFn(jsxfn) {
  return jsxfn.toString().replace('function () {', '').replace(/}$/, '');
}

function renderAllFrameworks(jsxfn) {
  const str = jsxRemoveFn(jsxfn);

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
    reactStable.firstChild,
    reactPatched.firstChild,
    preactDiv.firstChild
  ];
}

function renderToStringAllFrameworks(jsxfn) {
  const str = jsxRemoveFn(jsxfn);

  window.h = ReactStable.createElement;
  const reactStable = ReactDOMServerStable.renderToString(eval(str));

  window.h = ReactPatched.createElement;
  const reactPatched = ReactDOMServerPatched.renderToString(eval(str));

  window.h = preact.createElement;
  const preactStr = preactRenderToString(eval(str));

  window.h = undefined;

  function removeReactRoot(str) {
    return str.replace(` data-reactroot=""`, '');
  }

  return [
    removeReactRoot(reactStable),
    removeReactRoot(reactPatched),
    preactStr
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
          <td>${JSON.stringify(stable[prop])}</td>
          <td>${JSON.stringify(patched[prop])}</td>
          <td>${JSON.stringify(preact[prop])}</td>
        </tr>
        <tr>
          <td>${prop} - attribute</td>
          <td>${JSON.stringify(stable.getAttribute(prop))}</td>
          <td>${JSON.stringify(patched.getAttribute(prop))}</td>
          <td>${JSON.stringify(preact.getAttribute(prop))}</td>
        </tr>`);
  });
}

function renderPropertyAndAttribute(title, property, stable, patched, preact) {
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>${title} - ${property} property</td>
      <td>${JSON.stringify(stable[property])}</td>
      <td>${JSON.stringify(patched[property])}</td>
      <td>${JSON.stringify(preact[property])}</td>
    </tr>
    <tr>
      <td>${title} - ${property} attribute</td>
      <td>${JSON.stringify(stable.getAttribute(property))}</td>
      <td>${JSON.stringify(patched.getAttribute(property))}</td>
      <td>${JSON.stringify(preact.getAttribute(property))}</td>
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
  const [stable, patched, preact] = renderAllFrameworks(function(){<my-custom-element
    onstringprop="foo"
    oncustomevent={event => event.target.oncustomeventfired = true}
    oncustomeventCapture={event => event.target.oncustomeventcapturefired = true}
    onClick={event => event.target.onclickfired = true}
  ><div /></my-custom-element>});

  renderPropertyAndAttribute('onstringprop="foo"', 'onstringprop', stable, patched, preact);

  function isBubblingHandlerRun(element) {
    element.oncustomeventfired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: true}));
    return element.oncustomeventfired;
  }
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEvent event handler gets run with bubbling</td>
      <td>${isBubblingHandlerRun(stable)}</td>
      <td>${isBubblingHandlerRun(patched)}</td>
      <td>${isBubblingHandlerRun(preact)}</td>
    </tr>`);

  function isNonBubblingHandlerRun(element) {
    element.oncustomeventfired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: false}));
    return element.oncustomeventfired;
  }
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEvent event handler gets run without bubbling</td>
      <td>${isNonBubblingHandlerRun(stable)}</td>
      <td>${isNonBubblingHandlerRun(patched)}</td>
      <td>${isNonBubblingHandlerRun(preact)}</td>
    </tr>`);

  function isCaptureHandlerRun(element) {
    element.oncustomeventcapturefired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: false}));
    return element.oncustomeventcapturefired;
  }
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEventCapture event handler gets run during capture</td>
      <td>${isCaptureHandlerRun(stable)}</td>
      <td>${isCaptureHandlerRun(patched)}</td>
      <td>${isCaptureHandlerRun(preact)}</td>
    </tr>`);

  function isClickHandlerRun(element) {
    element.onclickfired = false;
    element.click();
    return element.onclickfired;
  }
  tbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onClick event handler gets run</td>
      <td>${isClickHandlerRun(stable)}</td>
      <td>${isClickHandlerRun(patched)}</td>
      <td>${isClickHandlerRun(preact)}</td>
    </td>`);
}

document.body.insertAdjacentHTML('beforeend',
  `<h4>renderToString tests</h4>`);

const renderToStringTable = document.createElement('table');
document.body.appendChild(renderToStringTable);
renderToStringTable.insertAdjacentHTML('beforeend',
  `<thead><tr><td>Input JSX</td><td>React</td><td>React Patched</td><td>Preact</td>`);
const renderToStringTbody = document.createElement('tbody');
renderToStringTable.appendChild(renderToStringTbody);

function addRenderToStringTest(title, jsxstr, jsxfn) {
  const [stable, patched, preact] = renderToStringAllFrameworks(jsxfn);

  const tr = document.createElement('tr');
  renderToStringTbody.appendChild(tr);

  const titletd = document.createElement('td');
  tr.appendChild(titletd);
  const titlediv = document.createElement('div');
  //titletd.appendChild(titlediv);
  titlediv.textContent = title;
  const jsxstrdiv = document.createElement('div');
  titletd.appendChild(jsxstrdiv);
  jsxstrdiv.textContent = jsxstr;
  jsxstrdiv.classList.add('code');

  const stabletd = document.createElement('td');
  tr.appendChild(stabletd);
  stabletd.textContent = stable;

  const patchedtd = document.createElement('td');
  tr.appendChild(patchedtd);
  patchedtd.textContent = patched;

  const preacttd = document.createElement('td');
  tr.appendChild(preacttd);
  preacttd.textContent = preact;
}

addRenderToStringTest('renderToString htmlFor custom element',
  `<my-custom-element htmlFor="foo" />`,
  function(){<my-custom-element htmlFor="foo" />});

addRenderToStringTest('renderToString htmlFor div',
  `<div htmlFor="foo" />`,
  function(){<div htmlFor="foo" />});

addRenderToStringTest('renderToString for custom element',
  `<my-custom-element for="foo" />`,
  function(){<my-custom-element for="foo" />});

/*addRenderToStringTest('renderToString for div',
  `<div for="foo" />`,
  function(){<div for="foo" />});*/

addRenderToStringTest('renderToString className custom element',
  `<my-custom-element className="foo" />`,
  function(){<my-custom-element className="foo" />});

addRenderToStringTest('renderToString className div',
  `<div className="foo" />`,
  function(){<div className="foo" />});

addRenderToStringTest('renderToString class custom element',
  `<my-custom-element class="foo" />`,
  function(){<my-custom-element class="foo" />});

/*addRenderToStringTest('renderToString class div',
  `<div class="foo" />`,
  function(){<div class="foo" />});*/

addRenderToStringTest('renderToString boolean custom element',
  `<my-custom-element attr={true} />`,
  function(){<my-custom-element attr={true} />});

/*addRenderToStringTest('renderToString boolean div',
  `<div attr={true} />`,
  function(){<div attr={true} />});*/

addRenderToStringTest('renderToString array custom element',
  `<my-custom-element attr={['one', 'two']} />`,
  function(){<my-custom-element attr={['one', 'two']} />});

addRenderToStringTest('renderToString array div',
  `<div attr={['one', 'two']} />`,
  function(){<div attr={['one', 'two']} />});

addRenderToStringTest('renderToString object custom element',
  `<my-custom-element attr={{property: 'value'}} />`,
  function(){<my-custom-element attr={{property: 'value'}} />});

addRenderToStringTest('renderToString object div',
  `<div attr={{property: 'value'}} />`,
  function(){<div attr={{property: 'value'}} />});

addRenderToStringTest('renderToString onClick custom element',
  `<my-custom-element onClick="foo" />`,
  function(){<my-custom-element onClick="foo" />});

addRenderToStringTest('renderToString onClick div',
  `<div onClick="foo" />`,
  function(){<div onClick="foo" />});

addRenderToStringTest('renderToString onClick fn custom element',
  `<my-custom-element onClick={() => console.log('foo')} />`,
  function(){<my-custom-element onClick={() => console.log('foo')} />});

addRenderToStringTest('renderToString onClick fn div',
  `<div onClick={() => console.log('foo')} />`,
  function(){<div onClick={() => console.log('foo')} />});

addRenderToStringTest('renderToString onCustomEvent custom element',
  `<my-custom-element onCustomEvent="foo" />`,
  function(){<my-custom-element onCustomEvent="foo" />});

/*addRenderToStringTest('renderToString onCustomEvent div',
  `<div onCustomEvent="foo" />`,
  function(){<div onCustomEvent="foo" />});

addRenderToStringTest('renderToString onCustomEvent fn custom element',
  `<my-custom-element onCustomEvent={() => console.log('foo')} />`,
  function(){<my-custom-element onCustomEvent={() => console.log('foo')} />});

addRenderToStringTest('renderToString onCustomEvent fn div',
  `<div onCustomEvent="foo" />`,
  function(){<div onCustomEvent="foo" />});*/
