/** @jsx h */

class StableWrapper extends ReactStable.Component {
  constructor() {
    super();
    window.stableWrapper = this;
  }
  render() { return this.props.children; }
};
class PatchedWrapper extends ReactPatched.Component {
  constructor() {
    super();
    window.patchedWrapper = this;
  }
  render() { return this.props.children; }
};
class PreactWrapper extends preact.Component {
  constructor() {
    super();
    window.preactWrapper = this;
  }
  render() { return this.props.children; }
};


document.body.insertAdjacentHTML('beforeend',
  `<h3>Properties and Attributes</h3>
  <div>my-custom-element has a property setter registered for "setter" and "onsetter"</div>`);

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
  get setter() { return this._setter || 'setter default value'; }
  set setter(newValue) { this._setter = newValue; }

  get onsetter() { return this._onsetter || 'setter default value'; }
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
  function(){<div htmlFor="foo" />},
  `<div htmlFor="foo" />`,
  'htmlFor');
renderPropAttr(
  function(){<div htmlFor="foo" />},
  `<div htmlFor="foo" />`,
  'for');

renderPropAttr(
  function(){<my-custom-element children="foo" />},
  `<my-custom-element children="foo" />`,
  'children');

renderPropAttr(
  function(){<my-custom-element key="foo" />},
  `<my-custom-element key="foo" />`,
  'key');

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

document.body.insertAdjacentHTML('beforeend', `<h3>renderToString</h3>`);
const renderToStringTable = document.createElement('table');
document.body.appendChild(renderToStringTable);
renderToStringTable.insertAdjacentHTML('beforeend',
  `<thead><tr>
    <td>Input JSX</td>
    <td>React Output</td>
    <td>React Patched Output</td>
    <td>Preact Output</td>
  </tr></thead>`);
const renderToStringTbody = document.createElement('tbody');
renderToStringTable.appendChild(renderToStringTbody);

function addRenderToStringTest(jsxstr, jsxfn) {
  const originalConsoleError = console.error;
  console.error = function() {};
  const [stable, patched, preact] = renderToStringAllFrameworks(jsxfn);
  console.error = originalConsoleError;

  const tr = document.createElement('tr');
  renderToStringTbody.appendChild(tr);

  const titletd = document.createElement('td');
  tr.appendChild(titletd);
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

addRenderToStringTest(
  `<my-custom-element htmlFor="foo" />`,
  function(){<my-custom-element htmlFor="foo" />});

addRenderToStringTest(
  `<div htmlFor="foo" />`,
  function(){<div htmlFor="foo" />});

addRenderToStringTest(
  `<my-custom-element for="foo" />`,
  function(){<my-custom-element for="foo" />});

/*addRenderToStringTest('renderToString for div',
  `<div for="foo" />`,
  function(){<div for="foo" />});*/

addRenderToStringTest(
  `<my-custom-element className="foo" />`,
  function(){<my-custom-element className="foo" />});

addRenderToStringTest(
  `<div className="foo" />`,
  function(){<div className="foo" />});

addRenderToStringTest(
  `<my-custom-element class="foo" />`,
  function(){<my-custom-element class="foo" />});

/*addRenderToStringTest('renderToString class div',
  `<div class="foo" />`,
  function(){<div class="foo" />});*/

addRenderToStringTest(
  `<my-custom-element attr={true} />`,
  function(){<my-custom-element attr={true} />});

addRenderToStringTest(
  `<div attr={true} />`,
  function(){<div attr={true} />});

addRenderToStringTest(
  `<my-custom-element attr={['one', 'two']} />`,
  function(){<my-custom-element attr={['one', 'two']} />});

addRenderToStringTest(
  `<div attr={['one', 'two']} />`,
  function(){<div attr={['one', 'two']} />});

addRenderToStringTest(
  `<my-custom-element attr={{property: 'value'}} />`,
  function(){<my-custom-element attr={{property: 'value'}} />});

addRenderToStringTest(
  `<div attr={{property: 'value'}} />`,
  function(){<div attr={{property: 'value'}} />});

addRenderToStringTest(
  `<div onClick="foo" />`,
  function(){<div onClick="foo" />});
addRenderToStringTest(
  `<div onClickCapture="foo" />`,
  function(){<div onClickCapture="foo" />});
addRenderToStringTest(
  `<div onclick="foo" />`,
  function(){<div onclick="foo" />});
addRenderToStringTest(
  `<div onclickcapture="foo" />`,
  function(){<div onclickcapture="foo" />});
addRenderToStringTest(
  `<div onClick={() => console.log('foo')} />`,
  function(){<div onClick={() => console.log('foo')} />});
addRenderToStringTest(
  `<div onCustomEvent={() => console.log('foo')} />`,
  function(){<div onCustomEvent={() => console.log('foo')} />});

addRenderToStringTest(
  `<my-custom-element onClick="foo" />`,
  function(){<my-custom-element onClick="foo" />});
addRenderToStringTest(
  `<my-custom-element onClickCapture="foo" />`,
  function(){<my-custom-element onClickCapture="foo" />});
addRenderToStringTest(
  `<my-custom-element onclick="foo" />`,
  function(){<my-custom-element onclick="foo" />});
addRenderToStringTest(
  `<my-custom-element onclickcapture="foo" />`,
  function(){<my-custom-element onclickcapture="foo" />});
addRenderToStringTest(
  `<my-custom-element onClick={() => console.log('foo')} />`,
  function(){<my-custom-element onClick={() => console.log('foo')} />});
addRenderToStringTest(
  `<my-custom-element onCustomEvent={() => console.log('foo')} />`,
  function(){<my-custom-element onCustomEvent={() => console.log('foo')} />});

addRenderToStringTest(
  `<my-custom-element onCustomEvent="foo" />`,
  function(){<my-custom-element onCustomEvent="foo" />});
addRenderToStringTest(
  `<my-custom-element onCustomEventCapture="foo" />`,
  function(){<my-custom-element onCustomEventCapture="foo" />});
addRenderToStringTest(
  `<my-custom-element oncustomevent="foo" />`,
  function(){<my-custom-element oncustomevent="foo" />});
addRenderToStringTest(
  `<my-custom-element oncustomeventcapture="foo" />`,
  function(){<my-custom-element oncustomeventcapture="foo" />});

document.body.insertAdjacentHTML('beforeend',
  `<h3>Upgrade, SSR, hydration, and render</h3>
<p>This section throws custom element upgrade at various points in the<br>
SSR lifecycle and examines what the effect is on the custom element.<br>
The steps in the 'lifecycle' run here are:<br>
1. Set innerHTML to SSR output from renderToString<br>
2. Hydrate<br>
3. Call forceUpdate on the component passed to hydrate
</p>`);

// 1. SSR
// 2. Hydration
// 3. forceUpdate

class MyCustomElementBeforeSsr extends HTMLElement {
  static tagName = 'my-custom-element-beforessr';
  get setter() { return this._setter || 'setter default value'; }
  set setter(newValue) { this._setter = newValue; }
};
class MyCustomElementBeforeHydration extends HTMLElement {
  static tagName = 'my-custom-element-beforehydration';
  get setter() { return this._setter || 'setter default value'; }
  set setter(newValue) { this._setter = newValue; }
};
class MyCustomElementBeforeForceUpdate extends HTMLElement {
  static tagName = 'my-custom-element-beforeforceupdate';
  get setter() { return this._setter || 'setter default value'; }
  set setter(newValue) { this._setter = newValue; }
};
class MyCustomElementAfterForceUpdate extends HTMLElement {
  static tagName = 'my-custom-element-afterforceupdate';
  get setter() { return this._setter || 'setter default value'; }
  set setter(newValue) { this._setter = newValue; }
};

runUpgradeTest(
  MyCustomElementBeforeSsr,
  'Upgrade before innerHTML = renderToString',
  0);
runUpgradeTest(
  MyCustomElementBeforeHydration,
  'Upgrade before hydration',
  1);
runUpgradeTest(
  MyCustomElementBeforeForceUpdate,
  'Upgrade before forceUpdate',
  2);
runUpgradeTest(
  MyCustomElementAfterForceUpdate,
  'Upgrade after forceUpdate',
  3);

function runUpgradeTest(customElement, title, step) {
  document.body.insertAdjacentHTML('beforeend', `<h4>${title}</h4>`);
  const upgradeTable = document.createElement('table');
  document.body.appendChild(upgradeTable);
  upgradeTable.insertAdjacentHTML('beforeend',
    `<thead><tr>
      <td>Step</td>
      <td>React Output</td>
      <td>React Patched Output</td>
      <td>Preact Output</td>
    </tr></thead>`);
  const upgradeTbody = document.createElement('tbody');
  upgradeTable.appendChild(upgradeTbody);

  const stableRoot = document.createElement('div');
  const patchedRoot = document.createElement('div');
  const preactRoot = document.createElement('div');
  function upgrade() {
    customElements.define(customElement.tagName, customElement);
    customElements.upgrade(stableRoot);
    customElements.upgrade(patchedRoot);
    customElements.upgrade(preactRoot);
  }

  if (step === 0)
    upgrade();

  const jsxfn = function(){<WrapperComponent><replace-me setter="foo" /></WrapperComponent>};
  const jsxstr = jsxRemoveFn(jsxfn).replace('replace-me', customElement.tagName);
  console.log('jsxstr: ' + jsxstr);

  window.h = ReactStable.createElement;
  window.WrapperComponent = StableWrapper;
  const stableSsr = ReactDOMServerStable.renderToString(eval(jsxstr));
  window.h = ReactPatched.createElement;
  window.WrapperComponent = PatchedWrapper;
  const patchedSsr = ReactDOMServerPatched.renderToString(eval(jsxstr));
  //const patchedSsr = ReactDOMServerPatched.renderToString(<WrapperComponent><my-custom-element-beforessr /></WrapperComponent>);
  window.h = preact.createElement;
  window.WrapperComponent = PreactWrapper;
  const preactSsr = preactRenderToString(eval(jsxstr));
  window.h = undefined;
  window.WrapperComponent = undefined;


  stableRoot.innerHTML = stableSsr;
  patchedRoot.innerHTML = patchedSsr;
  preactRoot.innerHTML = preactSsr;
  const stableCE = stableRoot.querySelector(customElement.tagName);
  const patchedCE = patchedRoot.querySelector(customElement.tagName);
  //patchedCE.removeAttribute('setter');
  const preactCE = preactRoot.querySelector(customElement.tagName);

  function appendUpdate(title) {
    const preTitleText = customElements.get(customElement.tagName)
      ? 'CE upgraded<br>'
      : 'CE not upgraded yet<br>';
    upgradeTbody.insertAdjacentHTML('beforeend',
      `<tr>
        <td>${preTitleText}${title}</td>
        <td class=stable>attribute: ${JSON.stringify(stableCE.getAttribute('setter'))}<br>property: ${JSON.stringify(stableCE.setter)}</td>
        <td class=patched>attribute: ${JSON.stringify(patchedCE.getAttribute('setter'))}<br>property: ${JSON.stringify(patchedCE.setter)}</td>
        <td class=preact>attribute: ${JSON.stringify(preactCE.getAttribute('setter'))}<br>property: ${JSON.stringify(preactCE.setter)}</td>
      </tr>`);
  }

  appendUpdate(`After innerHTML=renderToString, before hydration`);

  if (step === 1)
    upgrade();

  window.h = ReactStable.createElement;
  window.WrapperComponent = StableWrapper;
  ReactDOMStable.hydrate(eval(jsxstr), stableRoot);
  window.h = ReactPatched.createElement;
  window.WrapperComponent = PatchedWrapper;
  ReactDOMPatched.hydrate(eval(jsxstr), patchedRoot);
  window.h = preact.createElement;
  window.WrapperComponent = PreactWrapper;
  preact.hydrate(eval(jsxstr), preactRoot);
  window.h = undefined;
  window.WrapperComponent = undefined;

  appendUpdate(`After hydration, before forceUpdate`);

  if (step === 2)
    upgrade();

  stableWrapper.forceUpdate();
  patchedWrapper.forceUpdate();
  preactWrapper.forceUpdate();

  appendUpdate(`After forceUpdate`);

  if (step === 3) {
    upgrade();
    appendUpdate(`After upgrade after forceUpdate`);
  }
}

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
