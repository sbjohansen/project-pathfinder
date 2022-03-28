import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';


class FinderPage {
  constructor(element){
    const thisFinder = this;

    thisFinder.render(element);
    thisFinder.initGrid();   
    thisFinder.initDrawing(); 
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
    thisFinder.dom.gridContainer = document.querySelector(select.containerOf.gridContainer);
    thisFinder.clickedGrid = [];
    thisFinder.gridStart = '';
    thisFinder.gridFinish = '';

    thisFinder.lastClicked = '';
    thisFinder.startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    thisFinder.startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    thisFinder.computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

  }

  initGrid(){
    const thisFinder = this;

    const container = document.querySelector(select.containerOf.gridContainer);

    function makeRows(rows, cols) {
      container.style.setProperty(settings.gridRows, rows);
      container.style.setProperty(settings.gridCols, cols);
      let c = 0;
      for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement('div');
        //cell.innerText = (c + 1);
        container.appendChild(cell).className = classNames.finder.gridItem;
        container.appendChild(cell).setAttribute('id', c + 1 );
      }
    }
    
    thisFinder.action = true;

    makeRows(10, 10);
  }


  initActions(){
    const thisFinder = this;

    const startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    const computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

    thisFinder.buttonWrapper = thisFinder.dom.wrapper.querySelector(select.containerOf.buttonWrapper);



    startButton.addEventListener('click', function(event){
      event.preventDefault();

      startButton.classList.remove(classNames.finder.buttonActive);

      startFinishButton.classList.add(classNames.finder.buttonActive);

      thisFinder.dom.gridContainer.removeEventListener('click', thisFinder.initDrawing());
      thisFinder.lastClicked.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);

    });

    


  }


  
  initDrawing() {
    const thisFinder = this;

    

    const startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    const computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);
    thisFinder.action = true;

    console.log(startButton.classList.contains(classNames.finder.buttonActive));
    //ROUTE DRAWING EVENT LISTENER

    
    thisFinder.dom.gridContainer.addEventListener('click', function(event){
      const clickedElement = event.target;

      const clickedElementId = parseInt(event.target.getAttribute('id'));

      const cellRight = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 1 ));
      const cellLeft = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 1 ));
      const cellTop = thisFinder.clickedGrid.includes(parseInt(clickedElementId - 10 ));
      const cellBottom = thisFinder.clickedGrid.includes(parseInt(clickedElementId + 10 ));

      

      if(clickedElement.getAttribute('class') === classNames.finder.gridItem ){
    

        if(startButton.classList.contains(classNames.finder.buttonActive) === true){
        //check if there is any grid active 

          if(thisFinder.clickedGrid.length === 0  && startButton.classList.contains(classNames.finder.buttonActive) === true){

            thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));

            clickedElement.classList.add(classNames.finder.gridItemLastClicked);
            
            thisFinder.lastClicked = clickedElement;
            
          }
          // if there is grid active check for conditions for next active grid

          else if (thisFinder.clickedGrid.length >= 0 && startButton.classList.contains(classNames.finder.buttonActive) === true) {
            
            if (cellRight === true || cellLeft === true || cellBottom === true || cellTop === true ){
              
              thisFinder.clickedGrid.push(parseInt(clickedElement.getAttribute('id')));

              thisFinder.lastClicked.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);

              clickedElement.classList.add(classNames.finder.gridItemLastClicked);

              thisFinder.lastClicked = clickedElement;
              

            }
          }
        } 

        //CONDITIONS FOR REMOVING MARKED CELLS

        else if ( clickedElementId === thisFinder.clickedGrid[thisFinder.clickedGrid.length - 1] && startButton.classList.contains(classNames.finder.buttonActive) === true) {

          clickedElement.classList.remove(classNames.finder.gridItemClicked);
          clickedElement.classList.remove(classNames.finder.gridItemLastClicked);

          const clickedId = thisFinder.clickedGrid.indexOf(parseInt(clickedElement.getAttribute('id')));
          thisFinder.clickedGrid.splice(clickedId, 1);

          
          const previousClickedId = thisFinder.clickedGrid[thisFinder.clickedGrid.length - 1];

          thisFinder.lastClicked = document.getElementById(previousClickedId);


          if(thisFinder.lastClicked !== null){

            thisFinder.lastClicked.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemLastClicked);
          }
        } else {
          console.log('not last clicked');
        }
      }
    });



    
  }
}


//END OF ROUTE DRAWING EVENT LISTENER




export default FinderPage;