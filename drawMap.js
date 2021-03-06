

var map;
var roadAtlasStyles = 

[
			{
			    "featureType": "road.highway",
			    "elementType": "geometry",
			    "stylers": [
			      { "saturation": -100 },
			      { "lightness": -8 },
			      { "gamma": 1.18 }
			    ]
			}, {
			    "featureType": "road.arterial",
			    "elementType": "geometry",
			    "stylers": [
			      { "saturation": -100 },
			      { "gamma": 1 },
			      { "lightness": -24 }
			    ]
			}, {
			    "featureType": "poi",
			    "elementType": "geometry",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "administrative",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "transit",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "water",
			    "elementType": "geometry.fill",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "road",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "administrative",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "landscape",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			    "featureType": "poi",
			    "stylers": [
			      { "saturation": -100 }
			    ]
			}, {
			}
]


//initialize + show map 
function initialize() {

  var mapOptions = {
    	center: new google.maps.LatLng(51.507351, -0.127758),
    	zoom: 13,
    	panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false   
  };
  		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  		var styledMapOptions = {};           
  		var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);               
  		map.mapTypes.set('usroadatlas', usRoadMapType);
  		map.setMapTypeId('usroadatlas');
  		
}


$(document).ready(function(){
	
	//create the map in the DOM
	initialize();
	//keep heatmap data in an array 
	var heatmap = new Array();

	//limit the draws
	var limit = 60000;
	
	function makejourneys(){
	}
	
	function makemap(data){
		
				    var data_inner = data.getElementsByTagName("station");
								
								// CSV grabbed from local FS
								// you will need
								//
								//		Access-Control-Allow-Origin : "*"
								//
								// header set in your server's htaccess 
								
				    		Papa.parse("http://10.111.66.63:5000//cycle_data/data1.csv", {
				    			download: true,
				    			worker: true,
				    			step: function(row) {
				    			//dont read CSV headings
				    			if(!(row.data[0][0] == "Rental Id")){
		
				    				if(limit > 0){

//											Un-Comment to draw journeys 				    				
//											if limit is not reached yet
//				    					draw the polyline

//				    				  var cyclePath = new google.maps.Polyline({
//				    				    path: cycpath,
//				    				    geodesic: true,
//				    				    strokeColor: chroma.interpolate('#2C89C7', '#E74C3C', parseInt(row.data[0][1]) / 1000),
//				    				    strokeOpacity: 1.0,
//				    				    strokeWeight: 1
//				    				});
//				    				  
//										cyclePath.setMap(map);

//										Add data to heatmap, until limit reached

				    				  heatmap.push(new google.maps.LatLng(parseFloat(data_inner[(parseInt(row.data[0][7])-1)].children[3].innerHTML), 
				    				  parseFloat(data_inner[(parseInt(row.data[0][7])-1)].children[4].innerHTML)));
				    				   				    				  
				    				 }else{
				    				 	//remove loading animation
				    				 	$('.loading_overlay').remove();
				    				 }
				    					limit -= 1;
										}
				    				
				    			},
				    			complete: function() {
				    				
				    				var pointArray = new google.maps.MVCArray(heatmap);
				    				
				    				heatmapLYR = new google.maps.visualization.HeatmapLayer({
				    				
				    				   data: pointArray,
				    				   radius: 20
				    				});
				    				//add to map show)
				    				heatmapLYR.setMap(map);
				    			}
				    		});
	}


		//get the locations of the stations as xml tree
		$.ajax({
		    type: "GET",
		    url: "stations.xml",
		    dataType: "xml",
		    success: makemap   
		 });
 
});
