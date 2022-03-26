import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';


class FinderPage {
  constructor(element){
    const thisFinder = this;

    thisFinder.render(element);
    thisFinder.initGrid();   
    thisFinder.initActions(); 
  }



  render(element){
    const thisFinder = this;

    /* generate HTML based on template */
    const generatedHTML = templates.finderPage();
    /* create element using utils.createElementFromHTML */
    thisFinder.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const finderContainer = document.querySelector(select.containerOf.finderPage);
    /* add element to menu */
    finderContainer.appendChild(thisFinder.element);


    thisFinder.dom = {};
    thisFinder.dom.wrapper = element;
    
  }

  initGrid(){

    const container = document.querySelector(select.containerOf.gridContainer);

    function makeRows(rows, cols) {
      container.style.setProperty(settings.gridRows, rows);
      container.style.setProperty(settings.gridCols, cols);
      let c = 0;
      for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement('div');
        cell.innerText = (c + 1);
        container.appendChild(cell).className = classNames.finder.gridItem;
        container.appendChild(cell).setAttribute('id', c + 1 );

      }
    }

    makeRows(10, 10);
  }
  
  initActions() {
    const thisFinder = this;

    thisFinder.dom.gridContainer = document.querySelector(select.containerOf.gridContainer);

    thisFinder.dom.gridContainer.addEventListener('click', function(event){
      const clickedElement = event.target;

      if(clickedElement.getAttribute('class') === classNames.finder.gridItem ){
        console.log(clickedElement);
        clickedElement.classList.add(classNames.finder.gridItemClicked);
      }

    });

  }
    
}

export default FinderPage;