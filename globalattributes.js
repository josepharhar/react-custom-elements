(async () => {
const table = document.createElement('table');
document.body.appendChild(table);
const thead = document.createElement('thead');
table.appendchild(thead);
const tbody = document.createElement('tbody');
table.appendchild(tbody);

thead.innerHTML = `
<tr>
  <td>Input</td>
  <td>Output</td>
  <td>React Stable</td>
  <td>React Patched</td>
  <td>Preact</td>
</tr>
`;

function prettifyTable(table) {
  table.querySelectorAll('tbody').forEach(tbody => {
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
}

})();
