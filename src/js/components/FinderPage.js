import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';


class FinderPage {
  constructor(element){
    const thisFinder = this;

    thisFinder.render(element);
    thisFinder.initGrid();   
    //thisFinder.initDrawing(); 
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
    thisFinder.gridStart = 0;
    thisFinder.gridFinish = 0;

    thisFinder.lastClicked = '';
    thisFinder.startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    thisFinder.startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    thisFinder.computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

    thisFinder.stageOne = document.querySelector(classNames.finder.stageOne);
    thisFinder.stageTwo = document.querySelector(classNames.finder.stageTwo);
    thisFinder.stageThree = document.querySelector(classNames.finder.stageThree);

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
        cell.innerText = (c + 1);
        container.appendChild(cell).className = classNames.finder.gridItem;
        container.appendChild(cell).setAttribute('id', c + 1 );
      }
    }
    
    thisFinder.initDrawing();

    makeRows(10, 10);
  }


  initActions(){
    const thisFinder = this;

    const startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    const computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

    thisFinder.buttonWrapper = thisFinder.dom.wrapper.querySelector(select.containerOf.buttonWrapper);



    startButton.addEventListener('click', function(event){
      //const thisFinder = this;
      
      event.preventDefault();


      startButton.classList.remove(classNames.finder.buttonActive);
      startFinishButton.classList.add(classNames.finder.buttonActive);


      thisFinder.stageOne.classList.remove(classNames.finder.buttonActive);
      thisFinder.stageTwo.classList.add(classNames.finder.buttonActive);

      thisFinder.lastClicked.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);

      thisFinder.initStartFinish();

      thisFinder.dom.gridContainer.removeEventListener('click', thisFinder.initDrawing(event));

    });

    startFinishButton.addEventListener('click', function(event){
      //const thisFinder = this;
      
      event.preventDefault();


      startFinishButton.classList.remove(classNames.finder.buttonActive);

      computeButton.classList.add(classNames.finder.buttonActive);

      thisFinder.initCompute();
      
      thisFinder.stageTwo.classList.remove(classNames.finder.buttonActive);
      thisFinder.stageThree.classList.add(classNames.finder.buttonActive);

      

    });

    computeButton.addEventListener('click', function(event){
      //const thisFinder = this;
      
      event.preventDefault();


      computeButton.classList.remove(classNames.finder.buttonActive);

      startButton.classList.add(classNames.finder.buttonActive);

      

      for(let cell of thisFinder.dom.gridContainer.children){
        cell.classList.remove(classNames.finder.gridItemClicked);
        cell.classList.remove(classNames.finder.start);
        cell.classList.remove(classNames.finder.finish);
        cell.classList.remove(classNames.finder.path);

        thisFinder.gridStart = 0;
        thisFinder.gridFinish = 0;
        thisFinder.clickedGrid = [];

      }

      thisFinder.stageThree.classList.remove(classNames.finder.buttonActive);
      thisFinder.stageOne.classList.add(classNames.finder.buttonActive);

    });

  }


  
  initDrawing() {
    const thisFinder = this;

    

    const startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    thisFinder.action = true;

    //console.log(startButton.classList.contains(classNames.finder.buttonActive));
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
          if (startFinishButton.classList.contains(classNames.finder.buttonActive) === true) {
            clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.start);

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

        //END OF ROUTE DRAWING EVENT LISTENER

      }
    });

  }

  initStartFinish(){
    const thisFinder = this;

    const startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);

    
    thisFinder.dom.gridContainer.addEventListener('click', function(event){

      const clickedElement = event.target;

      const clickedElementId = parseInt(event.target.getAttribute('id'));
    
      if(clickedElement.classList.contains(classNames.finder.gridItemClicked)){
        
        
        if(startFinishButton.classList.contains(classNames.finder.buttonActive) === true && thisFinder.gridStart === 0){
        
          clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.start);
          thisFinder.gridStart = clickedElementId;

        } else if (
          startFinishButton.classList.contains(classNames.finder.buttonActive) === true && 
        !clickedElement.classList.contains(classNames.finder.start) && 
        thisFinder.gridFinish === 0 && thisFinder.gridStart !== 0){
          clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.finish);
          thisFinder.gridFinish = clickedElementId;

          //console.log(thisFinder.gridStart, thisFinder.gridFinish);
        }

        
      }
    });
  }


  initCompute(){
    const thisFinder = this;

    const startXY = thisFinder.gridStart;
    const finishXY = thisFinder.gridFinish;

    const startElement = document.getElementById(startXY);
    const finishElement = document.getElementById(finishXY);

    let startY = Math.floor((startXY + 10)/10);
    let startX = startXY - (Math.floor((startXY)/10)*10);

    let finishY = Math.floor((finishXY + 10)/10);
    let finishX = finishXY - (Math.floor((finishXY)/10)*10);


    console.log('col', 'Sx', startX,  'Sy', startY);
    console.log('col', 'Fx', finishX, 'Fy', finishY);
    
    
    if( parseInt(startX) === 0){
      startX = 10;
    }

     
    if( parseInt(finishX) === 0){
      finishX = 10;
    }
    let routeX = '';
    let routeY = '';

    thisFinder.coordXY = '';

    if(startX > finishX){
      if( parseInt(startX) === 0){
        startX = 10;
      }

    
      if( parseInt(finishX) === 0){
        finishX = 10;
      }
    
      routeX = startX - finishX;

     

      for(let i = 0; i < routeX + 1; i++){
        //console.log('bb');
        const pathElem = document.getElementById(thisFinder.gridStart - i );
        //pathElem.classList.remove(classNames.finder.gridItemClicked, classNames.finder.start, classNames.finder.finish);
        console.log('test');
        pathElem.classList.add(classNames.finder.path);
        startElement.classList.replace(classNames.finder.start, classNames.finder.path);
        finishElement.classList.replace(classNames.finder.finish, classNames.finder.path);
        console.log('col', 'Sx', startX,  'Sy', startY);
        console.log('col', 'Fx', finishX, 'Fy', finishY);

      }

    } else if (startX < finishX) {
      
      if( parseInt(startX) === 0){
        startX = 10;
      }
      if( parseInt(finishX) === 0){
        finishX = 10;
      }
      
      routeX = finishX - startX;
      
      for(let i = 0 ; i < routeX + 1 ; i++){
        console.log('bb');
        const pathElem = document.getElementById(thisFinder.gridStart + i );
        pathElem.classList.add(classNames.finder.path);

        pathElem.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        startElement.classList.replace(classNames.finder.start, classNames.finder.path);
        startElement.classList.replace(classNames.finder.finish, classNames.finder.path);

      }
    } else {
      routeX = 9;
      console.log('route 10');
    }
 
    if(startY > finishY){
      routeY = startY - finishY;

      console.log(thisFinder.gridFinish);

      for(let i = 0; i < routeY; i++){
        //console.log('bb');
        const pathElem = document.getElementById(thisFinder.gridFinish + (i*10));
        pathElem.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        pathElem.classList.add(classNames.finder.path);

        console.log(pathElem);
        finishElement.classList.replace(classNames.finder.finish, classNames.finder.path);
        startElement.classList.replace(classNames.finder.start, classNames.finder.path);

      }
      


      
    } else if (startY < finishY) {
      
      
      
      
      routeY = finishY - startY;

     

      for(let i = 0; i < routeY + 1; i++){
        const pathElem = document.getElementById(thisFinder.gridFinish - (i*10));
        //pathElem.classList.remove(classNames.finder.gridItemClicked, classNames.finder.start, classNames.finder.finish);
        pathElem.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        pathElem.classList.add(classNames.finder.path);

        finishElement.classList.replace(classNames.finder.finish, classNames.finder.path);
        
      }
    } else {
      routeY = 9;
    }

    //console.log ('routeX:', routeX, 'routeY', routeY);


 

    console.log(thisFinder.coordXY);
  }
}






export default FinderPage;