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

    thisFinder.clickedGrid = [];

    thisFinder.lastClicked = '';
    thisFinder.lastClickedBackup = '';



    //ROUTE DRAWING EVENT LISTENER

    thisFinder.dom.gridContainer.addEventListener('click', function(event){
      const clickedElement = event.target;

      const clickedElementId = parseInt(event.target.getAttribute('id'));

      const cellRight = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 1 ));
      const cellLeft = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 1 ));
      const cellTop = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 10 ));
      const cellBottom = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 10 ));
      const cellBottomRight = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 11 ));
      const cellBottomLeft = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 9 ));
      const cellTopLeft = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 11 ));
      const cellTopRight = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 9 ));


      if(clickedElement.getAttribute('class') === classNames.finder.gridItem ){
     
        //check if there is any grid active 

        if(thisFinder.clickedGrid.length === 0){

          thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));

          clickedElement.classList.add(classNames.finder.gridItemClicked);
          
          thisFinder.lastClicked = parseInt(clickedElementId);
          console.log('thisfinder', thisFinder.clickedGrid);
          
        }
        // if there is grid active check for conditions for next active grid

        else if (thisFinder.clickedGrid.length >= 0) {
          
          if (cellRight === true || cellLeft === true || cellBottom === true|| cellTop === true ){
            
            thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));
            clickedElement.classList.add(classNames.finder.gridItemClicked);
            thisFinder.lastClicked = clickedElementId;
            thisFinder.lastClickedBackup = clickedElement;
            console.log('before', thisFinder.clickedGrid);
          }
        }
      } 
      else if(thisFinder.lastClickedBackup.classList.contains(classNames.finder.gridItemClicked) && thisFinder.lastClicked != clickedElementId){
        console.log('cant be removed2');
        //remove cell when conditions are right
      } else if(cellRight === true && cellLeft === true && cellBottom === true ||

            cellRight === true && cellLeft === true && cellTop === true ||
            cellBottom === true && cellLeft === true && cellBottom === true ||
            cellBottom === true && cellRight === true && cellBottom === true ||    
            cellBottom === true && cellRight === true && cellBottom === true ||
            cellBottom === true && cellLeft === true && cellBottom === true ||
            cellBottomRight === true && cellRight === true && cellTopLeft === true ||
            cellBottomRight === true && cellLeft === true && cellTopLeft === true ||
            cellRight === true && cellLeft === true && cellTopLeft === true ||
            cellRight === true && cellLeft === true && cellBottomRight === true ||
            cellBottomRight === true && cellRight === false && cellLeft === false ||
            cellTopLeft === true && cellRight === false &&cellLeft === false ||
            cellTop === false && cellBottom === false && cellTopRight === true ||
            thisFinder.clickedGrid.includes(parseInt(clickedElementId)) === true ||
            cellRight === true && cellLeft === true && cellBottom === false && cellTop === false ||
            cellBottom === true && cellTop === true && cellRight === false && cellLeft === false    
      ){
        if (
        
          cellRight === true && cellLeft === true && cellBottom === false && cellTop === false ||
          cellBottom === true && cellTop === true && cellRight === false && cellLeft === false
         

          )
        {
          console.log('cant remove, line');
          return;

        } else {
          clickedElement.classList.remove(classNames.finder.gridItemClicked);
          const clickedId = thisFinder.clickedGrid.indexOf(parseInt(clickedElement.getAttribute('id')));
          thisFinder.clickedGrid.splice(clickedId, 1);
          thisFinder.lastClicked = clickedElementId;
          console.log('after', thisFinder.clickedGrid);
        }
      }
    }
        
    );
  }

  //END OF ROUTE DRAWING EVENT LISTENER

}


export default FinderPage;