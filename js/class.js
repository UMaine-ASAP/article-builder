/************************************
*** Class for the Stage and Grid ****
*** NOTE: 'POC' = Proof of Concept***
*************************************/
var KineticWrapper = new Class ({
	initialize: function(container, width, height)
	{
		// Creates the Kinetic Stage based on parameters declared in index.html
		this.stage = new Kinetic.Stage({
          container: container,
          width: width,
          height: height
        });

		// Initializes an array that will hold content objects
		this.objects = [];

        // Initialize a layer specific to the Content Box
        contentBoxLayer = new Kinetic.Layer();
        this.stage.add(contentBoxLayer);

        // Initialize a layer that will hold the objects and adds it to the stage
        this.layer = new Kinetic.Layer();
        this.stage.add(this.layer);

        // Sets up grid background
        this.layer.add(new Kinetic.Rect({
          fill: 'white',
          x: 192,
          y: 0,
          width: 962,
          height: 832,
          listening: false,
          name: "background"
        }));

        // Sets up the X-grid lines
        for (var i=64; i<1152; i+=64)
        {
        	this.layer.add(new Kinetic.Line({
	          points: [i+128, 0, i+128, 768],
	          stroke: "9D362C",
	          strokeWidth: 2,
	          lineCap: "round",
	          lineJoin: "round",
	          opacity: 0.25,
            listening: false
          	}));
        }
        // Sets up the Y-grid lines
        for (var i=0; i<832; i+=64)
        {
        	this.layer.add(new Kinetic.Line({
	          points: [194, i, 1152, i],
	          stroke: "9D362C",
	          strokeWidth: 2,
	          lineCap: "round",
	          lineJoin: "round",
	          opacity: 0.25,
            listening: false
          	}));
        }

        // Content Box
        // Using a placeholder image as a Fill, still need to work out some issues

        contentBoxLayer.add(new Kinetic.Rect({
          x: 14,
          width: 160,
          height: 768,
          fill: "E1B569",
          strokeWidth: 0,
          listening: false,
          cornerRadius: 5
        }));

        // Content Box Text
        contentBoxLayer.add(new Kinetic.Text({
          x: 42,
          y: 15,
          text: "Content",
          fontSize: 24,
          fontStyle: "bold",
          fontFamily: "Calibri",
          textFill: "black",
          listening: false
        }));

        // Title of Article
        this.layer.add(new Kinetic.Text({
          x: 256,
          y: 28,
          text: "Article Builder",
          fontSize: 36,
          textStrokeWidth: 2,
          fontFamily: "Calibri",
          textFill: "black",
          listening: false,
          shadow: {
          color: 'black',
          blur: 10,
          offset: [5, 5],
          opacity: 0.3
        }
        }));

        // Author of Article
        this.layer.add(new Kinetic.Text({
          x: 256,
          y: 104,
          text: "Boot Buddy",
          fontSize: 24,
          listening: false,
          textStrokeWidth: 1.5,
          fontFamily: "Calibri",
          textFill: "blue",
          shadow: {
          color: 'black',
          blur: 10,
          offset: [5, 5],
          opacity: 0.3
        }
        }));

        // Refreshes the stage to show grid lines
        this.stage.draw();
	},

	// Return the objects on the layer
	getLayer: function()
	{
		return this.layer;
		//return this.objects;
	},

	// Adds a Content Object to the Objects array
	addContent: function(x , y, type, img)
	{
		this.objects.push(new KineticObject(this, x, y, type, img)); // 'this' is the KineticWrapper
    this.objects[0].setOrginalParams(x, y);
	},

  updateControls: function(objectSelected) {
    this.layer.add(new Kinetic.Circle({
      x: objectSelected.getX(),
      y: objectSelected.getY(),
      width: 15,
      height: 15,
      fill: "red",
      name: "close"
    }));

    this.stage.draw();
  },

  removeControls: function() {
    var test = this.stage.get('.close');
    test[0].remove();
    this.stage.draw();
  },

	// Sets the active (clicked) object to have a different stroke color than other objects
	// Defining what Properties show up in the Properties Box could also be done here
	makeActive: function(objectSelected)
	{
    // POC: This 'if' determines if the clicked object is a piece of Content or a Control 
    if(objectSelected.getName() != 'close') {
		for (var i=0; i < this.objects.length; i++) {
			this.objects[i]['rect'].setStroke('black');
		}

		objectSelected.setStroke('yellow');
  }
  // POC: If it is a Control, perform that Controls function (currently just 'Close')
  else {
    var tempPosX = objectSelected.getX();
    var tempPosY = objectSelected.getY();

    for(var i = 0; i < this.objects.length; i++) {
      if((this.objects[i]['rect'].getX() == tempPosX) && (this.objects[i]['rect'].getY() == tempPosY)) {
        this.objects[i]['rect'].setX(32);
        this.objects[i]['rect'].setY(64);
        this.stage.draw();
      }
      else {
        //console.log(this.objects[i]);
      }
    }
  }
	},

  // Checks to see if a piece of content is part of the Article
  partOfArticle: function(objectSelected)
  {
    // Grabbing the size of the Grid
    // Grabs all items with the name 'background' (hence, the need for the array position)
    var bgX = this.stage.get('.background')[0].getX();
    var bgWidth = this.stage.get('.background')[0].getWidth();

    // Variables to store the objects X and Y
    var shapeX = objectSelected.getX();
    var shapeY = objectSelected.getY();

    // Checks to see if the object is on the Grid or not
    if ((shapeX >= bgX) && (shapeX <= bgWidth+bgX)){
      console.log("Is part of article: Yes");
    }
    else {
      console.log("Is part of article: No");
    }
  },

  // Converts the stage to JSON for database purposes
  jsonDerulo: function() {
    var json = this.stage.toJSON();
    //console.log(json);
  },

	chooseProperties: function(stage, objectSelected) {
    // For proof of concept purposes.  This makes sure clicking any of the Controls does
    // not bring up Properties
    if(objectSelected.getName() != 'close') {
		 var container = $("#data_container");

		 	// Default properties that are applicable regardless of content type
            container.html("Width: <div><input id=width class=param type=\"text\" value=\"" + objectSelected.getWidth() + 
            	"\"></div>Height: <div><input id=height class=param type=\"text\" value=\"" + objectSelected.getHeight() + 
            	"\"></div>");

            // Press enter to make changes.  This functionality should probably be changed to a submit button at some point
            $(".param").keypress(function(e) {
              if(e.which == 13)
              {
                if($(this).attr("id") == "width")
                {
                  var modifiedWidth = $(this).val();	
                  objectSelected.setWidth(modifiedWidth);
                  stage.draw();
                }
                else if($(this).attr("id") == "height")
                {
                  var modifiedHeight = $(this).val();
                  objectSelected.setHeight(modifiedHeight);
                  stage.draw();
                }
              }
            });

            // Example of how we can add additional properties based on the type of content
            switch(objectSelected.getId())
            {
            	case 1:
            	container.append("Stroke Width: <div><input id=strokeWidth class=param type=\"text\" value=\"" + objectSelected.getStrokeWidth() + "\"></div>");

            	// For some reason, this actively changes the color (before hitting Enter).  I don't know why.
            	$(".param").keypress(function(e){
            		if(e.which == 13)
            		{
            			if($(this).attr("id") == "strokeWidth")
            			{
            				objectSelected.setStrokeWidth($(this).val());
            				stage.draw();
            			}
            		}
            	});
            	break;
            }
	}
}
});

/***********************************
**** Class for Content Objects *****
***********************************/

var KineticObject = new Class ({

	initialize: function(kineticWrap, x, y, type, img)
	{

  var originalX
  var originalY;

		switch(type)
		{
			case 0: // Add a Video Indicator to the Stage
      // Using a placeholder image as a Fill, still need to work out some issues
      var imageObj = new Image();
      imageObj.src = img;

			this.rect = new Kinetic.Image({
          		x: x,
          		y: y,
          		width: 128,
          		height: 64,
              image: imageObj,
          		stroke: 'black',
          		strokeWidth: 2,
          		draggable: true,
          		id: 0,
        	});

        	kineticWrap.layer.add(this.rect);
        	break;

        case 1: // Add an Image Indicator to the Stage
        // Using a placeholder image as a Fill, still need to work out some issues
        var imageObj = new Image();
        imageObj.src = img;

			  this.rect = new Kinetic.Image({
          		x: x,
          		y: y,
          		width: 128,
          		height: 64,
              image: imageObj,
          		stroke: 'black',
          		strokeWidth: 2,
          		draggable: true,
          		id: 1,
        	});
        	//console.log("Image");
        	kineticWrap.layer.add(this.rect);
        	break;

        	case 2: // Add a Text Indicator to the Stage
          // Using a placeholder image as a Fill, still need to work out some issues
          var imageObj = new Image();
          imageObj.src = img;

			    this.rect = new Kinetic.Image({
          		x: x,
          		y: y,
          		width: 128,
          		height: 64,
              image : imageObj,
          		stroke: 'black',
          		strokeWidth: 2,
          		draggable: true,
          		id: 2,
        	});
        	//console.log("Text");
        	kineticWrap.layer.add(this.rect);
        	break;

        	case 3: // Add an Audio Indicator to the Stage
          // Using a placeholder image as a Fill, still need to work out some issues
          var imageObj = new Image();
          imageObj.src = img;

			    this.rect = new Kinetic.Image({
          		x: x,
          		y: y,
          		width: 128,
          		height: 64,
              image : imageObj,
          		stroke: 'black',
          		strokeWidth: 2,
          		draggable: true,
          		id: 3,
        	});
        	//console.log("Audio");
        	kineticWrap.layer.add(this.rect);
        	break;
		}
		// Re-draw stage
		kineticWrap.stage.draw();
	},

  setOrginalParams: function(tempX, tempY){
    originalX = tempX;
    originalY = tempY;
  },
});