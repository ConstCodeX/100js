const $ = (tag) => document.querySelector(tag);

const table = $('table');
const tbody = $('tbody');
const thead = $('thead');

let ROWS_MAX = 5;
let COLS_MAX = 5;

let clickedElement = null;

document.addEventListener('mousedown', function (event) {

  clickedElement = event.target;
});


const ROWS = Array.from({ length: ROWS_MAX }, (_, indexRow) => {
  return Array.from({ length: COLS_MAX }, (_, i) => {
    return i === 0 ? (indexRow + 1) : { value: '0', formula: '0' };
  })
});

const calculateRowName = (columnNumber) => {
  let columnName = '';
  while (columnNumber > 0) {
    let remainder = (columnNumber - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    columnNumber = Math.floor((columnNumber - 1) / 26);
  }
  return columnName;
}

const renderHead = () => {
  const ths = Array.from({ length: COLS_MAX }, (_, i) => i === 0 ? '' : calculateRowName(i));
  const trh = document.createElement('tr');
  ths.forEach((th) => {
    const thElement = document.createElement('th');
    thElement.addEventListener('click', () => {
      lintAllCellsFromCol(thElement);
    });
    thElement.innerHTML = th;
    trh.appendChild(thElement);
  });
  thead.appendChild(trh);
}


const cleanLintsCol = () => {
  const listSelectedCells = document.querySelectorAll('.select-cell-col');
  for (let i = 0; i < listSelectedCells.length; i++) {
    listSelectedCells[i].classList.remove('select-cell-col');
  }
}

const cleanLintsRow = () => {
  const listSelectedCells = document.querySelectorAll('.select-cell-row');
  for (let i = 0; i < listSelectedCells.length; i++) {
    listSelectedCells[i].classList.remove('select-cell-row');
  }
}

const lintAllCellsFromCol = (col) => {
  cleanLintsCol();
  document.querySelectorAll('.select-col').forEach((otherCol) => {
    if (otherCol.innerText !== col.innerText) {
      otherCol.classList.remove('select-col');
    }
  });
  if (col.classList.contains('select-col')) {
    col.classList.remove('select-col');
    return
  }
  const colId = col.innerText;
  for (let i = 0; i < ROWS_MAX; i++) {
    const cell = document.getElementById(`${colId}${i + 1}`);
    if (cell) {
      cell.classList.add('select-cell-col');
    }
  }
  col.setAttribute('class', 'select-col');
}


const lintAllCellsFromRow = (row) => {
  cleanLintsRow();
  document.querySelectorAll('.select-row').forEach((otherRow) => {
    if (otherRow.innerText !== row.innerText) {
      otherRow.classList.remove('select-row');
    }
  });
  console.log(row.classList.contains('select-row'))
  if (row.classList.contains('select-row')) {
    row.classList.remove('select-row');
    return
  }
  const rowId = row.innerText;
  for (let i = 0; i < COLS_MAX; i++) {
    const cell = document.getElementById(`${String.fromCharCode(i + 64)}${rowId}`);
    if (cell) {
      cell.classList.add('select-cell-row');
    }
  }
  row.setAttribute('class', 'select-row');
}

const renderRows = () => {
  tbody.innerHTML = '';
  ROWS.forEach((row, indexRow) => {
    const tr = document.createElement('tr');
    const tbodyValues = row;
    tbodyValues.forEach((data, indexCol) => {
      const thElement = document.createElement('th');
      if (indexCol !== 0) {
        thElement.setAttribute('id', `${String.fromCharCode(indexCol + 64)}${indexRow + 1}`);
        thElement.addEventListener('click', () => {
          const inputElementExist = document.getElementById('input');
          if (thElement.children.length === 0 && !inputElementExist)
            onClickCellEditable(thElement);
        });
        const val = calculateValueToCell(data?.value || '');
        thElement.innerHTML = val;
        thElement.setAttribute('data-formula', data?.formula || '');
      } else {
        thElement.innerHTML = data
        thElement.addEventListener('click', () => {
          lintAllCellsFromRow(thElement);
        });
      }
      tr.appendChild(thElement);
    });
    tbody.appendChild(tr);
  });
}

const onClickCellEditable = (cell) => {
  const id = cell.getAttribute('id');
  let value = cell.innerHTML;
  let formula = cell.getAttribute('data-formula');
  putInputInsedeIdElement(id, value, formula);
}

const putInputInsedeIdElement = (id, value, formula) => {
  const element = document.getElementById(id);
  element.innerHTML = '';

  const input = document.createElement('input');

  clickedElement = null;

  input.setAttribute('id', 'input');

  input.addEventListener('blur', (event) => {
    const value = event.target.value;
    if (value.startsWith('=')) {
      event.preventDefault();
      if (clickedElement) {
        event.target.value += findReferences(clickedElement.getAttribute('id'))[0] ?? '';
      }
      event.target.focus();
    } else {
      inputBlur(event.target);
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      inputBlur(event.target);
    }
    else if (event.key === 'Escape') {
      input.value = '';
      inputBlur(event.target);
    }
  });

  input.addEventListener('input', (event) => {
    const value = event.target.value;
    if (value.startsWith('=')) {
      lintCellsReferedTemporary(findReferences(input.value));
    }
  });

  element.appendChild(input);

  input.setAttribute('data-cell-id', id);
  input.style.display = 'block';
  if (formula !== value) {
    input.value = formula;
  } else {
    input.value = value;
  }
  input.focus();
  if (input.value.startsWith('=')) {
    lintCellsReferedTemporary(findReferences(input.value));
  }
}

const lintCellsReferedTemporary = (references) => {
  for (let i = 0; i < references.length; i++) {
    const id = references[i];
    const element = document.getElementById(id);
    element.classList.add('lint-cell');
    element.style.backgroundColor = randomColor(i);
  }
}

const randomColor = (index) => {
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];
  return colors[index % colors.length];
}

const inputBlur = (element) => {
  const _input = element;
  if (!_input) return;
  const value = element.value;
  const id = _input.getAttribute('data-cell-id');
  if (value !== '') {
    if (!id) return;
    const [col, row] = id.match(/[A-Z]+|[0-9]+/g);
    const colNum = parseInt(col.charCodeAt() - 64);
    const rowNum = parseInt(row) - 1;
    ROWS[rowNum][colNum].value = value;
    ROWS[rowNum][colNum].formula = value;
  }
  _input.remove();
  const cell_lints = document.querySelectorAll('.lint-cell');
  for (let i = 0; i < cell_lints.length; i++) {
    cell_lints[i].classList.remove('lint-cell');
    cell_lints[i].style.backgroundColor = 'transparent';
  }
  renderRows();
}

const calculateValueToCell = (value) => {
  let formula = '';
  let valueToShow = value;
  if (value.startsWith('=')) {
    formula = value;
    valueToShow = calculateValueFromOtherCell(value);
    value = valueToShow;
  }
  return value;
}

const calculateValueFromOtherCell = (value) => {
  try {
    let formula = value.substring(1);
    const references = findReferences(value);
    if (references.length > 0) {
      for (let i = 0; i < references.length; i++) {
        let reference = references[i];
        const [col, row] = reference.match(/[A-Z]+|[0-9]+/g);
        const colNum = parseInt(col.charCodeAt() - 64);
        const rowNum = parseInt(row) - 1;
        const referenceValue = calculateValueToCell(ROWS[rowNum][colNum].formula || '0');
        formula = formula.replace(reference, referenceValue);
      }
    }
    return String(eval(formula));
  } catch (error) {
    return "!!Error";
  }
}

const findReferences = (value) => {
  return value.match(/\$?[A-Z]+\$?\d+/g) ?? [];
}

const render = () => {
  renderHead();
  renderRows();
}

render();