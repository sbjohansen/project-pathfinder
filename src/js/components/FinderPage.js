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

    let lastClicked = '';
    let lastClickedBackup = '';


    //ROUTE DRAWING EVENT LISTENER

    thisFinder.dom.gridContainer.addEventListener('click', function(event){
      const clickedElement = event.target;

      const clickedElementId = parseInt(event.target.getAttribute('id'));


      
      if(clickedElement.getAttribute('class') === classNames.finder.gridItem ){
     
        //check if there is any grid active 

        if(thisFinder.clickedGrid.length === 0){

          thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));

          clickedElement.classList.add(classNames.finder.gridItemClicked);
          
          lastClicked = parseInt(clickedElementId);
          //console.log('thisfinder', thisFinder.clickedGrid);
        }
        // if there is grid active check for conditions for next active grid

        else if (thisFinder.clickedGrid.length > 0) {
          
          if (thisFinder.clickedGrid.includes(parseInt(clickedElementId + 1  )) === true ||
          thisFinder.clickedGrid.includes(parseInt(clickedElementId - 1  )) === true ||
          thisFinder.clickedGrid.includes(parseInt(clickedElementId + 10  )) === true||
          thisFinder.clickedGrid.includes(parseInt(clickedElementId - 10  )) === true){
            thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));

            clickedElement.classList.add(classNames.finder.gridItemClicked);
            lastClicked = clickedElementId;
            lastClickedBackup = clickedElement;
            //console.log('before', thisFinder.clickedGrid);
          }
        }
      } 
      else {

        //check are conditions met for cell to be unmarked

        if(clickedElementId === lastClicked || 
          clickedElementId === lastClicked + 1 || 
          clickedElementId === lastClicked - 1 ||
          clickedElementId === lastClicked + 10 ||
          clickedElementId === lastClicked - 10 ){
          if(lastClickedBackup.classList.contains(classNames.finder.gridItemClicked) && lastClicked != clickedElementId){
            //console.log('cant be removed');
            
            //remove cell when conditions are right
          } else {
            
            

            if(thisFinder.clickedGrid.includes(parseInt(clickedElementId + 1  )) === true && 
            thisFinder.clickedGrid.includes(parseInt(clickedElementId - 1  )) === true ||
            thisFinder.clickedGrid.includes(parseInt(clickedElementId + 10  )) === true && 
            thisFinder.clickedGrid.includes(parseInt(clickedElementId - 10  )) === true
            ){
              
              console.log('cannot be removed');
              
              
            } else {
              clickedElement.classList.remove(classNames.finder.gridItemClicked);
              const clickedId = thisFinder.clickedGrid.indexOf(clickedElement.getAttribute('id'));
              thisFinder.clickedGrid.splice(clickedId, 1);
              lastClicked = clickedElementId;
              //console.log('clickedid', clickedId);
              //console.log('after', thisFinder.clickedGrid);
            }
          }
        }
      }
    });

    //END OF ROUTE DRAWING EVENT LISTENER

  }
}

export default FinderPage;