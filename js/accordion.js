(function () {

	/**
	 *
	 * @param options
	 * @constructor
	 */
	function Accordion(options) {
		"use strict";
		var renderTo = options.renderTo;
		var data = options.initData;
		var activeGroup = 1;

		// обработчики общие на корневом элементе.
		renderTo.onclick = function (event) {
			if (event.target.className === 'accord__control') {
				toggle(event.target.dataset.control)
			} else if (event.target.parentNode.className === 'accord__control') {
				toggle(event.target.parentNode.dataset.control)
			}
		};

		renderTo.onmouseover = function (event) {
			if (event.target.className === 'accord__data accord__data-visible') {
				toggleActiveCol(true, event.target);
			}
		};

		renderTo.onmouseout = function (event) {
			if (event.target.className === 'accord__data accord__data-visible') {
				toggleActiveCol(true, event.target);
			}
		};

		function render() {
			renderTo.appendChild(genTable());
		}

		function toggle(group) {
			var items = renderTo.getElementsByClassName('accord__data');
			var controls = renderTo.getElementsByClassName('accord__control');
			for (var key in items) {
				if (typeof items[key] === 'object' && items[key].dataset.hasOwnProperty('group')) {
					items[key].classList.toggle("accord__data-visible");
					items[key].classList.toggle("accord__data-unvisible");
				}
			}
			for (var key in controls) {
				if (typeof controls[key] === 'object' && items[key].dataset.hasOwnProperty('group')) {
					controls[key].classList.toggle("accord__control-active");
				}
			}
		}

		function toggleActiveCol(active, node) {
			// позиция заголовка данной ячейки - position + значение data-block из за контролов
			// в остальных записях просто position
			var position = 0;
			// Выбираем ячейки до той ячейки на которой стоим
			var prevSibling = node;
			while (prevSibling = prevSibling.previousSibling) {
				// всем слева добавить класс
				position++;
				prevSibling.classList.toggle("accord__data_target");
			}
			// Выбираем ячейки над текущей и устанавливаем
			var parent = node.parentNode;
			while (parent = parent.previousSibling) {
				if (parent.previousSibling) {
					parent.childNodes[position].classList.toggle("accord__data_target");
				} else {
					// если previousSibling текущего parent = null то это заголовок таблицы
					var headerPosition = position + parseInt(node.dataset.group);
					parent.childNodes[headerPosition].classList.toggle("accord__header_target");
				}
			}
		}

		function genItem(group, textContent, tdSize, className) {
			var tdData = document.createElement('td');
			tdData.className = className;
			// 1 группа контролов и ячеек по умолчанию видна - активна
			if (group) {
				tdData.dataset.group = group;
				if (tdData.dataset.group === "1") {
					tdData.className = className + " accord__data-visible";
				} else {
					tdData.className = className + " accord__data-unvisible";
				}
			}
			tdData.textContent = textContent;
			// если 1 ячейка на блок , то считается комментарием (обычно последнее)
			if (tdSize > 1) {
				tdData.setAttribute("colspan", tdSize.toString());
			}
			return tdData;
		}

		function genColGroup() {
			var colGroup = document.createElement('colgroup');
			var col = document.createElement('col');
			// 1 столбец будет фиксированного размера
			col.setAttribute("width", "170px");
			colGroup.appendChild(col);
			return colGroup;
		}

		function genControlButton(controlTitle, dataSetNumber, rowSpan) {
			// создаем кнопки управления аккордеоном, в dataset пишем какую группу закрывает/открывает
			var tdControl = document.createElement('td');
			var div = document.createElement('div');
			var span = document.createElement('span');
			tdControl.className = "accord__control";
			tdControl.dataset.control = dataSetNumber;
			if (tdControl.dataset.control === "1") {
				tdControl.className = "accord__control accord__control-active"
			}
			tdControl.rowSpan = rowSpan;
			span.textContent = controlTitle;
			tdControl.appendChild(div);
			tdControl.appendChild(span);
			return tdControl;
		}

		function genTable() {
			var table = document.createElement('table');
			table.className = 'accord';
			var tbody = document.createElement('tbody');
			var paramNumber = 0;
			// каждый элемент массива - строка таблицы
			data.forEach(function (row, rowNumber) {
				var tr = document.createElement('tr');
				for (var dataGroup in row) {
					tr.appendChild(genItem(undefined, dataGroup, 1, "accord_first"));
					tbody.appendChild(tr);
					var dataSetNumber = 0;
					for (var dataValue in row[dataGroup]) {
						dataSetNumber++;
						// в первой строке таблицы содержатся кнопки управления
						if (rowNumber === 0) {
							tr.appendChild(genControlButton(dataValue, dataSetNumber, data.length));
							paramNumber = row[dataGroup][dataValue].length;
						}
						if (row[dataGroup][dataValue].length !== paramNumber) {
							tr.appendChild(genItem(dataSetNumber, row[dataGroup][dataValue], paramNumber.toString(), "accord__data accord__comment"));
						} else {
							row[dataGroup][dataValue].forEach(function (item) {
								// помечаем заголовки классом accord__header
								if (rowNumber === 0) {
									tr.appendChild(genItem(dataSetNumber, item, 1, "accord__header accord__data"));
								} else {
									tr.appendChild(genItem(dataSetNumber, item, 1, "accord__data"));
								}
							});
						}
					}
				}
			});
			table.appendChild(genColGroup());
			table.appendChild(tbody);
			return table;


		}

		this.render = render;
	}

	window.Accordion = Accordion

})();

/**
 * Представление данных из которых формируется компонент. Значения хранятся как ключ.
 * @type {{Параметры ипотечного кредита ( займа ): {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Приобретение готового жилья: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Приобретение	квартиры на этапе строительства: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Перекредитование: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Целевой кредит под залог имеющейся	квартиры: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Ипотека с государственной поддержкой: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}, Военная ипотека: {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]},  : {Значение процентной ставки, % годовых: [*], Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов: [*]}}}
 */

var initData = [{
	'Параметры ипотечного кредита ( займа )': {
		'Значение процентной ставки, % годовых': ['70%<К⁄З≤80%	', '50%<К⁄З≤70%', 'К⁄З≤50%'],
		'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Параметр 1', 'Параметр 2', 'Параметр 3']
	}
},
	{
		'Приобретение готового жилья': {
			'Значение процентной ставки, % годовых': ['12,75', '12,50', '12,25'],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…']
		}
	},
	{
		'Приобретение	квартиры на этапе строительства': {
			'Значение процентной ставки, % годовых': ['12,75', '12,50', '12,25'],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…']
		}
	},
	{
		'Перекредитование': {
			'Значение процентной ставки, % годовых': ['12,75', '12,50', '12,25'],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Широкое и объемное описание параметра параметра описание описание параметра…', 'Уточняйте у оператора', 'Уточняйте у оператора']
		}
	},
	{
		'Целевой кредит под залог имеющейся	квартиры': {
			'Значение процентной ставки, % годовых': ['-', '12,50 2', '12,25'],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['16,88%', '16,88%', '16,88%']
		}
	},
	{
		'Ипотека с государственной поддержкой': {
			'Значение процентной ставки, % годовых': ['11,25', '11,00', '12,25'],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…', 'Широкое и объемное описание параметра параметра описание описание параметра…']
		}
	},
	{
		'Военная ипотека': {
			'Значение процентной ставки, % годовых': ['', '11,50', ''],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Отсутствует', 'Отсутствует', 'Отсутствует']
		}
	},
	{
		' ': {
			'Значение процентной ставки, % годовых': [''],
			'Вычеты из процентной ставки (вычеты не суммируются), процентных пунктов': ['Не является публичной офертой. Все значения необходимо уточнять у оператора или в офисах компании']
		}
	}

];
/**
 * Опции объекта Аккордеона
 * @type {{initData: [*], renderTo: Element}}
 */
var options = {
	initData: initData,
	renderTo: document.getElementById('accordion-place')
};
var accordionInstance = new Accordion(options);
accordionInstance.render();