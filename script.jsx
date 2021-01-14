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
  /*background-color: lightgray;*/
  white-space: pre;
  font-family: monospace;
}
tbody > tr > td.warning {
  background-color: rgb(255,255,102);
}
tbody > tr > td.error {
  background-color: red;
}
tbody > tr > td.good {
  background-color: lightgray;
}
h3 {
  margin-bottom: 0;
}
`;

document.body.insertAdjacentHTML('beforeend', `<h3>Properties and Attributes</h3>`);

const table = document.createElement('table');
document.body.appendChild(table);
table.insertAdjacentHTML('beforeend',
  `<thead><tr>
    <td>JSX</td>
    <td>Output Function</td>
    <td>React Output</td>
    <td>React Patched Output</td>
    <td>Preact Output</td>
  </tr></thead>`);
const tbody = document.createElement('tbody');
table.appendChild(tbody);

class MyCustomElement extends HTMLElement {
  constructor() {
    super();
  }

  get setter() { return this._setter; }
  set setter(newValue) { this._setter = newValue; }

  get onsetter() { return this._onsetter; }
  set onsetter(newValue) { this._onsetter = newValue; }
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

function renderPropAttr(jsxfn, jsxstr, propName) {
  const [stable, patched, preact] = renderAllFrameworks(jsxfn);

  const rowOne = document.createElement('tr');
  tbody.appendChild(rowOne);
  rowOne.innerHTML =
    `<td class=code id=insert></td>
    <td class=code>element.${propName}</td>
    <td class="code stable">${JSON.stringify(stable[propName])}</td>
    <td class="code patched">${JSON.stringify(patched[propName])}</td>
    <td class="code preact">${JSON.stringify(preact[propName])}</td>`;
  rowOne.querySelector('#insert').textContent = jsxstr;

  const rowTwo = document.createElement('tr');
  tbody.appendChild(rowTwo);
  rowTwo.innerHTML =
    `<td class=code id=insert></td>
    <td class=code>element.getAttribute('${propName}')</td>
    <td class="code stable">${JSON.stringify(stable.getAttribute(propName))}</td>
    <td class="code patched">${JSON.stringify(patched.getAttribute(propName))}</td>
    <td class="code preact">${JSON.stringify(preact.getAttribute(propName))}</td>`;
  rowTwo.querySelector('#insert').textContent = jsxstr;
}

renderPropAttr(
  function(){<my-custom-element setter={true} />},
  `<my-custom-element setter={true} />`,
  'setter');
renderPropAttr(
  function(){<my-custom-element nosetter={true} />},
  `<my-custom-element nosetter={true} />`,
  'nosetter');
renderPropAttr(
  function(){<my-custom-element setter="string" />},
  `<my-custom-element setter="string" />`,
  'setter');
renderPropAttr(
  function(){<my-custom-element nosetter="string" />},
  `<my-custom-element nosetter="string" />`,
  'nosetter');
renderPropAttr(
  function(){<my-custom-element setter={['one', 'two']} />},
  `<my-custom-element setter={['one', 'two']} />`,
  'setter');
renderPropAttr(
  function(){<my-custom-element nosetter={['one', 'two']} />},
  `<my-custom-element nosetter={['one', 'two']} />`,
  'nosetter');
renderPropAttr(
  function(){<my-custom-element setter={{property: 'value'}} />},
  `<my-custom-element setter={{property: 'value'}} />`,
  'setter');
renderPropAttr(
  function(){<my-custom-element nosetter={{property: 'value'}} />},
  `<my-custom-element nosetter={{property: 'value'}} />`,
  'nosetter');

renderPropAttr(
  function(){<my-custom-element className="foo" />},
  `<my-custom-element className="foo" />`,
  'className');
renderPropAttr(
  function(){<my-custom-element className="foo" />},
  `<my-custom-element className="foo" />`,
  'class');

renderPropAttr(
  function(){<my-custom-element class="foo" />},
  `<my-custom-element class="foo" />`,
  'className');
renderPropAttr(
  function(){<my-custom-element class="foo" />},
  `<my-custom-element class="foo" />`,
  'class');

renderPropAttr(
  function(){<my-custom-element htmlFor="foo" />},
  `<my-custom-element htmlFor="foo" />`,
  'htmlFor');
renderPropAttr(
  function(){<my-custom-element htmlFor="foo" />},
  `<my-custom-element htmlFor="foo" />`,
  'for');

renderPropAttr(
  function(){<my-custom-element onsetter="foo" />},
  `<my-custom-element onsetter="foo" />`,
  'onsetter');
renderPropAttr(
  function(){<my-custom-element onnosetter="foo" />},
  `<my-custom-element onnosetter="foo" />`,
  'onnosetter');

document.body.insertAdjacentHTML('beforeend', `<h3>Event Handlers</h3>`);
const eventTable = document.createElement('table');
document.body.appendChild(eventTable);
eventTable.insertAdjacentHTML('beforeend',
  `<thead>
    <tr>
      <td>Test Description</td>
      <td>React Output</td>
      <td>React Patched Output</td>
      <td>Preact Output</td>
    </tr>
  </thead>`);
const eventTbody = document.createElement('tbody');
eventTable.appendChild(eventTbody);

{
  const [stable, patched, preact] = renderAllFrameworks(function(){<my-custom-element
    oncustomevent={event => event.target.oncustomeventfired = true}
    oncustomeventCapture={event => event.target.oncustomeventcapturefired = true}
    onClick={event => event.target.onclickfired = true}
  ><div /></my-custom-element>});

  function isBubblingHandlerRun(element) {
    element.oncustomeventfired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: true}));
    return element.oncustomeventfired;
  }
  eventTbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEvent event handler gets run with bubbling</td>
      <td class="code stable">${isBubblingHandlerRun(stable)}</td>
      <td class="code patched">${isBubblingHandlerRun(patched)}</td>
      <td class="code preact">${isBubblingHandlerRun(preact)}</td>
    </tr>`);

  function isNonBubblingHandlerRun(element) {
    element.oncustomeventfired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: false}));
    return element.oncustomeventfired;
  }
  eventTbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEvent event handler gets run without bubbling</td>
      <td class="code stable">${isNonBubblingHandlerRun(stable)}</td>
      <td class="code patched">${isNonBubblingHandlerRun(patched)}</td>
      <td class="code preact">${isNonBubblingHandlerRun(preact)}</td>
    </tr>`);

  function isCaptureHandlerRun(element) {
    element.oncustomeventcapturefired = false;
    element.dispatchEvent(new Event('customevent', {bubbles: false}));
    return element.oncustomeventcapturefired;
  }
  eventTbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onCustomEventCapture event handler gets run during capture</td>
      <td class="code stable">${isCaptureHandlerRun(stable)}</td>
      <td class="code patched">${isCaptureHandlerRun(patched)}</td>
      <td class="code preact">${isCaptureHandlerRun(preact)}</td>
    </tr>`);

  function isClickHandlerRun(element) {
    element.onclickfired = false;
    element.click();
    return element.onclickfired;
  }
  eventTbody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>onClick event handler gets run</td>
      <td class="code stable">${isClickHandlerRun(stable)}</td>
      <td class="code patched">${isClickHandlerRun(patched)}</td>
      <td class="code preact">${isClickHandlerRun(preact)}</td>
    </td>`);
}

document.body.insertAdjacentHTML('beforeend', `<h3>renderToString tests</h3>`);
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
  stabletd.classList.add('code', 'stable');

  const patchedtd = document.createElement('td');
  tr.appendChild(patchedtd);
  patchedtd.textContent = patched;
  patchedtd.classList.add('code', 'patched');

  const preacttd = document.createElement('td');
  tr.appendChild(preacttd);
  preacttd.textContent = preact;
  preacttd.classList.add('code', 'preact');
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

addRenderToStringTest('renderToString boolean div',
  `<div attr={true} />`,
  function(){<div attr={true} />});

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

document.querySelectorAll('tbody').forEach(tbody => {
  tbody.querySelectorAll('tr').forEach(tr => {
    const stable = tr.querySelector('.stable');
    const patched = tr.querySelector('.patched');
    const preact = tr.querySelector('.preact');
    if (!stable || !patched || !preact) {
      console.log('bad row:', tr);
      return;
    }

    const stableMatchesPatched = stable.textContent === patched.textContent;
    const patchedMatchesPreact = patched.textContent === preact.textContent;

    if (!stableMatchesPatched && !patchedMatchesPreact) {
      stable.classList.add('error');
      patched.classList.add('error');
      preact.classList.add('error');
    } else if (!stableMatchesPatched) {
      stable.classList.add('warning');
      patched.classList.add('warning');
      preact.classList.add('good');
    } else if (!patchedMatchesPreact) {
      stable.classList.add('good');
      patched.classList.add('warning');
      preact.classList.add('warning');
    } else {
      stable.classList.add('good');
      patched.classList.add('good');
      preact.classList.add('good');
    }
  });
});
