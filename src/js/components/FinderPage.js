import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';


class FinderPage {
  constructor(element){
    const thisFinder = this;

    thisFinder.stage = 1;

    thisFinder.render(element);
    thisFinder.getElements();

    thisFinder.initActions();
    
    thisFinder.grid = {};
    for(let row = 1; row <= 10; row++) {
      thisFinder.grid[row] = {};
      for(let col = 1; col <= 10; col++) {
        thisFinder.grid[row][col] = false;
      }
    }

    thisFinder.clickedGridOrderX = [];
    thisFinder.clickedGridOrderY = [];

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
    if(thisFinder.stage === 1){

      finderContainer.appendChild(thisFinder.element);


      thisFinder.dom = {
        wrapper: element,
        gridContainer: document.querySelector(select.containerOf.gridContainer),
        buttonWrapper: document.querySelector(select.containerOf.buttonWrapper),
      };



      thisFinder.initGrid();
    }
    
  }

  getElements(){
    const thisFinder = this;

    thisFinder.startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    thisFinder.startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    thisFinder.computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

    thisFinder.stageOne = document.querySelector(classNames.finder.stageOne);
    thisFinder.stageTwo = document.querySelector(classNames.finder.stageTwo);
    thisFinder.stageThree = document.querySelector(classNames.finder.stageThree);

    thisFinder.previouslyClickedElem = '';


  }

  changeStage(newStage) {
    const thisFinder = this;
    thisFinder.stage = newStage;

    thisFinder.markField();
  }

  initGrid(){
    const thisFinder = this;
    const container = thisFinder.dom.gridContainer;

    function makeRows(rows, cols) {
      container.style.setProperty(settings.gridRows, rows);
      container.style.setProperty(settings.gridCols, cols);
      for (rows = 1; rows <= 10; rows++) {
        for(cols = 1; cols <= 10; cols++){
          let cell = document.createElement('div');
          //cell.innerText = (c + 1);
          container.appendChild(cell).className = classNames.finder.gridItem;
          container.appendChild(cell).setAttribute('data-row', rows );
          container.appendChild(cell).setAttribute('data-col', cols );
        }
      }
    }
    
    makeRows(10, 10);

  }


  initActions(){
    const thisFinder = this;

    const startButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonStartFinish);
    const computeButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonCompute);


      

    thisFinder.dom.buttonWrapper.addEventListener('click', function(event) {
      event.preventDefault();

      const clickedElement = event.target;
      
      console.log(clickedElement);


      if(clickedElement.classList.contains(classNames.finder.buttonActive )){

        event.preventDefault();
        thisFinder.lastClicked.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
        thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
        thisFinder.changeStage(2);

        startButton.classList.remove(classNames.finder.buttonActive);
        startFinishButton.classList.add(classNames.finder.buttonActive);
      } if(clickedElement.classList.contains(classNames.finder.buttonActive )){
        
        startFinishButton.classList.remove(classNames.finder.buttonActive);
        computeButton.classList.add(classNames.finder.buttonActive);
        thisFinder.changeStage(3);

      } if (clickedElement.classList.contains(classNames.finder.buttonActive )){
        computeButton.classList.remove(classNames.finder.buttonActive);
        startButton.classList.add(classNames.finder.buttonActive);
        thisFinder.changeStage(1);

      }

    });

    thisFinder.dom.gridContainer.addEventListener('click', function(event) {

      event.preventDefault();

      const clickedElement = event.target;

      if(clickedElement.classList.contains(classNames.finder.gridItem) && thisFinder.stage === 1){

        thisFinder.markField(clickedElement);
      } else if (thisFinder.stage == 2) {

        if(clickedElement.classList.contains(classNames.finder.gridItemClicked)){

          thisFinder.startFinish(clickedElement);
        }
      }
    });

  } 

  markField(clickedElement){
    const thisFinder = this;

    if(thisFinder.stage === 1){
    //console.log(thisFinder.grid);

      const clickedField = {
        row: parseInt(clickedElement.getAttribute('data-row')),
        col: parseInt(clickedElement.getAttribute('data-col')),

      };


      //CHECK if item is marked, and if it's last marked item

      if(thisFinder.grid[clickedField.row][clickedField.col]) {

        if(clickedField.row === thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 1] && thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 1] === clickedField.col ){

          thisFinder.grid[clickedField.row][clickedField.col] = false;
          clickedElement.classList.remove(classNames.finder.gridItemLastClicked);

          thisFinder.clickedGridOrderX.pop();
          thisFinder.clickedGridOrderY.pop();


          //change last clicked item after removing last from array

          thisFinder.previouslyClickedElem = thisFinder.dom.gridContainer.querySelector('[data-col="' + thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 1] + '"]' + '[data-row="' + thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 1] + '"]' );


          if(thisFinder.previouslyClickedElem !== null){
            thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemLastClicked);
          }
        }
      }

      else {
        const gridValues = Object.values(thisFinder.grid)
          .map(col => Object.values(col))
          .flat();

        if(gridValues.includes(true)) {
          const edgeFields = [];
          if(clickedField.col > 1) edgeFields.push(thisFinder.grid[clickedField.row][clickedField.col-1]); //get field on the left value
          if(clickedField.col < 10) edgeFields.push(thisFinder.grid[clickedField.row][clickedField.col+1]); //get field on the right value
          if(clickedField.row > 1) edgeFields.push(thisFinder.grid[clickedField.row-1][clickedField.col]); //get field on the top value
          if(clickedField.row < 10) edgeFields.push(thisFinder.grid[clickedField.row+1][clickedField.col]); //get field on the bottom value

          if(!edgeFields.includes(true)){
            alert('A new field should touch at least one that is already selected!');
            return;
          }
        }
      
        thisFinder.grid[clickedField.row][clickedField.col] = true;
        clickedElement.classList.add(classNames.finder.gridItemLastClicked);

        thisFinder.lastClicked = clickedElement;
        //add cords to array for defining last, second last etc

        thisFinder.clickedGridOrderX.push(clickedField.row);
        thisFinder.clickedGridOrderY.push(clickedField.col);

        thisFinder.previouslyClickedElem = thisFinder.dom.gridContainer.querySelector('[data-col="' + thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 2] + '"]' + '[data-row="' + thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 2] + '"]' );

        if (thisFinder.previouslyClickedElem !== null){
          thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
        }
      }
    }
  }

  startFinish(clickedElement){
    const thisFinder = this;

    const clickedField = {
      row: parseInt(clickedElement.getAttribute('data-row')),
      col: parseInt(clickedElement.getAttribute('data-col')),

    };

    const gridValues = Object.values(thisFinder.grid)
      .map(col => Object.values(col))
      .flat();

    if(!gridValues.includes('start')){
      thisFinder.grid[clickedField.row][clickedField.col] = 'start';
      clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemStart);
    }

    if(clickedElement.classList.contains(classNames.finder.gridItemClicked) && !gridValues.includes('finish') && thisFinder.grid[clickedField.row][clickedField.col] !== 'start'){
      thisFinder.grid[clickedField.row][clickedField.col] = 'finish';
      clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemFinish);

    }
  }


  pathfinding(){


    
  }

}






export default FinderPage;