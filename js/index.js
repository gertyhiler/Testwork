
const btnAdds = document.querySelectorAll('.add'); // Поучаем коллекцию элементов кнопки добавить
const btnCalc = document.querySelector('.calc'); // Получаем кнопку CALC 
const canvas_1 = document.querySelector('#chart-1');    
const canvas_2 = document.querySelector('#chart-2');
const canvas_3 = document.querySelector('#chart-3');    //Получаем поля канвас 

function getXY (column) { // В переданной колонке фильтруем значения в зависимости от имени класса в массив значений 
    let xValue = [], 
        yValue = [],
        result = [];
    
    for (item of column) {
        item.className.split('_').includes('x') ? xValue.push(+item.value) : yValue.push(+item.value); 
    }

    xValue.map((v,i) => {
        let prevRes = [];
            prevRes.push(v, yValue[i]); 
            result.push(prevRes); 
    });
   return result; 
}

 //=== Определяем размер рабочей области 
    const WIDHT = 200;
    const HEIGHT = 200; // Определяем ширину и высоту блока канвас
    const DPI_WIDHT = WIDHT * 2;    
    const DPI_HEIGHT = HEIGHT * 2; // Определяем увеличенные значения 
    const PADDING = 40; 
    const LINE_WIDTH = 4;
//===

    function chart (canvas, columnNumber) {  // Отрисовка канвас
        const c = canvas.getContext("2d"); // Определяем контекст отрисовки
        canvas.widht = DPI_WIDHT; 
        canvas.height = DPI_HEIGHT; // Увеличиваем поле для рисования внутри блока (что-то вроде плотности пикселей)
        canvas.style.widht = WIDHT + 'px'; 
        canvas.style.height = HEIGHT + 'px'; // задаем размер блока элемента
        const column = document.querySelector(`.col-${columnNumber}`).querySelectorAll('input'); // Определяем в контексте какой колонки будем рисовать
        let valueColumn = getXY(column) // Приводим данный в красивый и понятный вид
        //===  
        let countRow = (DPI_WIDHT / PADDING) - 1;
        let countCol = (DPI_HEIGHT / PADDING) - 1;
        let font = "20px serif";
        // рисуем Y линию 
        c.beginPath();
        c.lineWidth = LINE_WIDTH;
        c.moveTo(0, PADDING); 
        c.lineTo(DPI_WIDHT, PADDING);
        c.stroke();
        c.closePath();
        // Риски на линии Y 
        c.beginPath();
        c.lineWidth = LINE_WIDTH - 2;
        c.moveTo(PADDING, PADDING);
        for (i = 1; i<= countRow; i++ ){
            let offset = PADDING * i; 
            c.moveTo(PADDING, offset); 
            c.lineTo(PADDING + 10, offset); 
        } 
        c.stroke();
        c.closePath();
        //цифры на линии Y
        c.beginPath();
        c.font = font;
        c.fillText("0", PADDING/2, PADDING - 10);
            for (i=1;i <= countRow; i++) {
                let offset = PADDING * i;
                c.fillText(i, PADDING/2, offset + PADDING);
            }
        c.stroke();
        c.closePath();
        
        // рисуем Х линию 
        c.beginPath();
        c.lineWidth = LINE_WIDTH;
        c.moveTo(PADDING, 0); 
        c.lineTo(PADDING, DPI_HEIGHT);
        c.stroke();
        c.closePath();
        //Риски X
        c.beginPath();
        c.lineWidth = LINE_WIDTH - 2;
        c.moveTo(PADDING, PADDING);
        for (i = 1; i<= countCol; i++ ){
            let offset = PADDING * i; 
            c.moveTo(offset, PADDING); 
            c.lineTo(offset, PADDING + 10 ); 
        } 
        c.stroke();
        c.closePath();
        // Цифры X
        c.beginPath();
        c.font = font;
            for (i=1; i <= countCol; i++) {
                let offset = PADDING * i;
                c.fillText(i, offset + PADDING - 5, PADDING/2 );
            }
        c.stroke()
        c.closePath()
        //==

        //==
        // Рисуем линию самого графика
        c.beginPath(); 
        c.lineWidth = LINE_WIDTH;
        c.moveTo(PADDING, PADDING); 
            for ([x,y] of valueColumn) {
                c.lineTo((x * PADDING) + PADDING, (y * PADDING) + PADDING);
            }
        c.stroke();
        c.closePath(); 
        //===
    
}


function addElementRow (event) { // Добавляет строку с полями ввода и кнопкой удаления
    let rowNumber = event.target.closest("div").childElementCount; // Определяем номер строки для нейминга классов 
// Шаблон элемента
    const HTMLElementRow = `<div class="row_${rowNumber}"> 
    <span>x</span>
    <input type="number" name="x" class="row_${rowNumber}_x">
    <span>y</span>
    <input type="number" name="y" class="row_${rowNumber}_y">
    <button class="del">Del</button>
    </div>`;
    event.target.insertAdjacentHTML("beforebegin", HTMLElementRow);  // Добавляем на странцу заполненный шаблон 
    return HTMLElementRow; 
}

function calculeteRow () { // Среднее арифмитическое всех элементов X и Y в виде {row-x:[срХ,срY]}
    let collectionElementsRow = document.querySelectorAll('input') , // Собираем коллекцию элементов
    objValueElement = {}; 

            for (elementCollection of collectionElementsRow ) { //Перебор всех элементов коллекции полей ввода

                objValueElement[elementCollection.className] = (objValueElement[elementCollection.className] != undefined ? (objValueElement[elementCollection.className] + +elementCollection.value)/2 : +elementCollection.value)
                // Вычилсение среднего арифмитического
            }
    return objValueElement; 
    // let collectElRow = document.querySelectorAll('input') 
    // let valuesInput = []; 

    // getXY(collectElRow)    
    // console.log('getXY(collectElRow): ', getXY(collectElRow));
}


for (let btnAdd of btnAdds) { // Назначаем на каждую кнопку добавить обработчик 
    btnAdd.addEventListener('click', (event) => {
       addElementRow(event);// В месте где был клик вставляем шаблон
    });
}


document.body.addEventListener('click', event => { // Обработка события по кнопке DEL
    event.target.className == 'del' ? event.target.closest('div').remove() : false; // если клик именно по кнопку удаления то удалить весь блок родитель
});

btnCalc.addEventListener('click', event => { // Событие клика на кнопке CALC 
    function removeRows (event) { // очистить столбик результатов вычислений средних значений
        let rowsColumn_3 = event.target.closest('div').querySelectorAll('div');
            for (row of rowsColumn_3) {
                row.remove(); 
            }
    }
    function checkRow (event) { // Проверяет количество строк у всех столбцов и выравнять их по высоте самого коротокого, возвращает минимальное количество строк
       let column_1 = event.path[2].childNodes[1]; 
       let column_2 = event.path[2].childNodes[3]; 
       let column_3 = event.path[2].childNodes[5];

        column_1.childElementCount < column_2.childElementCount ? column_2.removeChild(column_2.childNodes[(Number(column_2.childNodes.length-3))]) : column_1.childElementCount > column_2.childElementCount ? column_1.childElementCount < column_1.removeChild(column_1.childNodes[(Number(column_1.childNodes.length-3))]) : false; 
        return  column_3.childElementCount == column_1.childElementCount ? 0 : --column_2.childElementCount; 
    }
    
    removeRows (event);

    let countRow = checkRow(event); // Выравнять столбики 
    let objCalculateRow =  calculeteRow() // Посчитать средние арифмитическое 

    for (let i = 0; i < countRow; i++) { // Вставляет в третий стоблик результатов строки 
        addElementRow(event);    
    }
    ;

    let collect = event.path[1].querySelectorAll('.del') 
        for (item of collect) { // Удаление кнопки удалить у всех элементов третьего стролибка результатов 
            item.remove()
        }
    

    let inputsColumn_3 = event.target.closest('div').querySelectorAll('input'); 
    for (item of inputsColumn_3) { // Добавление в поля ввода третьего столба значений
        item.value = objCalculateRow[item.className];
    }

    chart (canvas_1, 1); 
    chart (canvas_2, 2); 
    chart (canvas_3, 3); // Отрисовка финальных графиков
});
