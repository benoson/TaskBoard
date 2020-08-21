(function() {

    // --------------- Global variables and declerations --------------- //

    let canvas = document.getElementById("myCanvas");
    let myCanvas = canvas.getContext('2d');

    // adding an event listener when we click on the canvas
    canvas.addEventListener("click", () => {
        onCanvasClick();
    });

    // adding an event listener when we click on the 'draw' button
    let drawButton = document.getElementById("drawBtn");
    drawButton.addEventListener("click", draw20By30Rect, false);

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    // declaring the calculate button, and adding an event listener
    let calculateButton = document.getElementById("calculateBtn");
    calculateButton.addEventListener("click", onRectDrawing, false);

    // declaring the calculate button, and adding an event listener
    let clearCanvasButton = document.getElementById("clearCanvasBtn");
    clearCanvasButton.addEventListener("click", clearCanvas, false);

    let rectLengthInput = document.getElementById("lengthInput");
    let rectHeightInput = document.getElementById("heightInput");
    let startingXinput = document.getElementById("startingPosXInput");
    let startingYinput = document.getElementById("startingPosYInput");

    // declaring all the error messages paragraphs
    let errorMsgForLength = document.getElementById("errorMsgForLength");
    let errorMsgForHeight = document.getElementById("errorMsgForHeight");
    let errorMsgForX = document.getElementById("errorMsgForX");
    let errorMsgForY = document.getElementById("errorMsgForY");

    // declaring the error message paragraph below the buttons
    let canvasErrorMsg = document.getElementById("errorMsgForCanvas");
    
    // declaring the text of the square area
    let areaOfRectangleText = document.getElementById("areaOfRectText");


    // drawing random rectangles continuously
    drawRandomRecanglesContinuously();

    

    // ----------------------------- Functions ----------------------------- //


    // -------------------- Model -------------------- //

    function saveCoords(startingX, startingY) {
        let coords = new Array(0);
        let positionOnCanvas = {
            x: startingX,
            y: startingY
        };

        coords.push(positionOnCanvas);

        // turning the coords array to a string
        let strCoords = JSON.stringify(coords);

        // setting the position of the clicked coords inside the canvas, to the sessionStorage
        sessionStorage.setItem("coords", strCoords);
    }



    // -------------------- View -------------------- //

    function drawRectangle() {
        let rectLength = +rectLengthInput.value;
        let rectHeight = +rectHeightInput.value;
        let startingX = +startingXinput.value;
        let startingY = +startingYinput.value;

        // drawing the rectangle with the desired sizes
        myCanvas.beginPath();
        myCanvas.rect(startingX, startingY, rectLength, rectHeight);
        myCanvas.strokeStyle = "black";
        myCanvas.stroke();

        calculateAreaOfRectangle();
    }


    function draw20By30Rect() {
        let coords = sessionStorage.getItem("coords");
        let parsedCoords = JSON.parse(coords);

        if (coords !== null) {
            let startingX = parsedCoords[0].x;
            let startingY = parsedCoords[0].y;
    
            // drawing a 20 by 30 rectangle
            myCanvas.beginPath();
            myCanvas.rect(startingX, startingY, 20, 30);
            myCanvas.strokeStyle = "black";
            myCanvas.stroke();
    
            clearAllInputs();
    
            clearSquareAreaText();
        }
    }


    function clearAllInputs() {
        rectLengthInput.innerHTML = "";
        rectHeightInput.innerHTML = "";
        startingXinput.innerHTML = "";
        startingYinput.innerHTML = "";
    }


    function clearErrorMessages() {
        errorMsgForLength.innerHTML = "";
        errorMsgForHeight.innerHTML = "";
        errorMsgForX.innerHTML = "";
        errorMsgForY.innerHTML = "";
        canvasErrorMsg.innerHTML = "";
    }


    function clearSquareAreaText() {
        areaOfRectangleText.innerHTML = "";
    }


    function clearCanvas() {
        // clearing the canvas
        myCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
    }


    function drawRandomRecanglesContinuously() {
        setInterval(() => {
            // defining random points inside the canvas
            let randomXpointInsideCanvas = Math.trunc(Math.random() * canvasWidth);
            let randomYpointInsideCanvas = Math.trunc(Math.random() * canvasHeight);

            // defining random sizes for the rectangle
            let randomRectLength = Math.trunc(Math.random() * 351);
            let randomRectHeight = Math.trunc(Math.random() * 351);


            myCanvas.beginPath();
            myCanvas.rect(randomXpointInsideCanvas, randomYpointInsideCanvas, randomRectLength, randomRectHeight);
            myCanvas.strokeStyle = "black";
            myCanvas.stroke();
        }, 5000);
    }



    // -------------------- Controller -------------------- //

    function onRectDrawing() {
        if (validateInputsAreValid() && validateRectDoesNotExceedCanvas()) {
            drawRectangle();
        }
    }


    function onCanvasClick() {
        let startingX = event.offsetX;
        let startingY = event.offsetY;
        
        if (validateManualRectangleDoesNotExceedCanvas(startingX, startingY)) {
            saveCoords(startingX, startingY);
        }
    }


    function validateInputsAreValid() {
        let trimmedRectLength = rectLengthInput.value.trim();
        let trimmedRectHeight = rectHeightInput.value.trim();
        let trimmedStartingX = +startingXinput.value.trim();
        let trimmedStartingY = +startingYinput.value.trim();

        let rectLength = Math.trunc( +rectLengthInput.value );
        let rectHeight = Math.trunc( +rectHeightInput.value );
        let rectStartingX = Math.trunc( +startingXinput.value );
        let rectStartingY = Math.trunc( +startingYinput.value );


        // clearing all the error messages
        clearErrorMessages();

        // clear the square area text
        clearSquareAreaText();


        // ------------------------------- validation of the length entered

        // checking if the length entered is not empty
        if (trimmedRectLength == "") {
            errorMsgForLength.innerHTML = "Please Enter a Number";
            return false;
        }

        // checking if the length entered is not a number
        if (isNaN(rectLength)) {
            errorMsgForLength.innerHTML = "Please Enter a Number";
            return false;
        }

        // checking if the X position is larger than the width of the canvas
        if (rectStartingX > canvasWidth) {
            errorMsgForX.innerHTML = "X cordinate Exceeds The Width of The Canvas";
            return false;
        }

        // checking if the length entered is at minimum 1
        if(rectLength <= 0) {
            errorMsgForLength.innerHTML = "Please Enter a Number at Minimum 1";
            return false;
        }


        // ------------------------------- validation of the height entered

        // checking if the height entered is not empty
        if (trimmedRectHeight == "") {
            errorMsgForHeight.innerHTML = "Please Enter a Number";
            return false;
        }

        // checking if the height entered is not a number
        if (isNaN(rectHeight)) {
            errorMsgForHeight.innerHTML = "Please Enter a Number";
            return false;
        }

        // checking if the Y position is larger than the height of the canvas
        if (rectStartingY > canvasHeight) {
            errorMsgForY.innerHTML = "Y cordinate Exceeds The Height of The Canvas";
            return false;
        }

        // checking if the height entered is at minimum 1
        if(rectHeight <= 0) {
            errorMsgForHeight.innerHTML = "Please Enter a Number at Minimum 1";
            return false;
        }

        
        // ------------------------------- validation of the starting X position entered

        // checking if the X position entered is not empty
        if (trimmedStartingX == "") {
            errorMsgForX.innerHTML = "Please Enter a Number Larger Than 0";
            return false;
        }

        // checking if the X position entered is not a number
        if (isNaN(rectStartingX)) {
            errorMsgForX.innerHTML = "Please Enter a Number Larger Than 0";
            return false;
        }

        // checking if the X position entered is at minimum 0
        if(rectStartingX < 0) {
            errorMsgForX.innerHTML = "Please Enter a Number at Minimum 1";
            return false;
        }


        // ------------------------------- validation of the starting Y position entered

        // checking if the Y position entered is not empty
        if (trimmedStartingY == "") {
            errorMsgForY.innerHTML = "Please Enter a Number Larger Than 0";
            return false;
        }

        // checking if the Y position entered is not a number
        if (isNaN(rectStartingY)) {
            errorMsgForY.innerHTML = "Please Enter a Number";
            return false;
        }

        // checking if the Y position entered is at minimum 0
        if(rectStartingY < 0) {
            errorMsgForY.innerHTML = "Please Enter a Number at Minimum 1";
            return false;
        }


        // if the validation passed, return true
        return true;
    }


    function validateRectDoesNotExceedCanvas() {
        let rectLength = +rectLengthInput.value;
        let rectHeight = +rectHeightInput.value;
        let startingX = +startingXinput.value;
        let startingY = +startingYinput.value;

        let rectEndingXpoint = startingX + rectLength;
        let rectEndingYpoint = startingY + rectHeight;


        // clearing all the error messages
        clearErrorMessages();

        // clear the square area text
        clearSquareAreaText();


        // checking if the length entered is larger than the canvas width
        if (rectLength > canvasWidth) {
            errorMsgForLength.innerHTML = "Length Exceeds The Width Of The Canvas";
            return false;
        }

        // checking if the height entered is larger than the canvas height
        if (rectHeight > canvasHeight) {
            errorMsgForHeight.innerHTML = "Height Exceeds The Width Of The Canvas";
            return false;
        }

        // checking if the end point of the X of the rectangle exceeds the canvas
        if (rectEndingXpoint > canvasWidth) {
            errorMsgForCanvas.innerHTML = "The Length Exceeds The Width Of The Canvas";
            return false;
        }

        // checking if the end point of the Y of the rectangle exceeds the canvas
        if (rectEndingYpoint > canvasHeight) {
            errorMsgForCanvas.innerHTML = "The Height Exceeds The Height Of The Canvas";
            return false;
        }

        // if the rectangle does not exceed the canvas, return true
        return true;
    }


    function validateManualRectangleDoesNotExceedCanvas(startingX, startingY) {
        let rectEndingXpoint = startingX + 20;
        let rectEndingYpoint = startingY + 30;

        // clearing all the error messages
        clearErrorMessages();

        // clear the square area text
        clearSquareAreaText();


        // checking if the end point of the X of the rectangle exceeds the canvas
        if (rectEndingXpoint > canvasWidth) {
            canvasErrorMsg.innerHTML = "The Length Of The Rectangle You Wish To Create Exceeds The Width Of The Canvas";
            return false;
        }

        // checking if the end point of the Y of the rectangle exceeds the canvas
        if (rectEndingYpoint > canvasHeight) {
            canvasErrorMsg.innerHTML = "The Height Of The Rectangle You Wish To Create Exceeds The Height Of The Canvas";
            return false;
        }

        // if the rectangle does not exceed the canvas, return true
        return true;
    }


    function calculateAreaOfRectangle() {
        let areaOfCreatedRectangle = rectLengthInput.value * rectHeightInput.value;

        areaOfRectangleText.innerHTML = areaOfCreatedRectangle;
    }

})();