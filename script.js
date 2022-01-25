

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/LayerList"
],(Map,SceneView,FeatureLayer,Graphic,GraphicsLayer,LayerList)=>{
    let map1=new Map({
        basemap:"topo-vector"
    });
    let view=new SceneView({
        map:map1,
        container:"mapa1",
        center:[-100.4593,36.9014],
        zoom:5
        
    });
//////////////////////////////////////
    let fl=new FeatureLayer({
        url:"https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });
    
    let simple={
        type:"simple",
        symbol:{
            type:"point-3d",
            symbolLayers:[
                {
                    type:"object",
                    resource:{
                        primitive:"cylinder"
                    },
                    width:5000
                }
            ]
        },
        label:"Earthquake",
        visualVariables:[
            {
                type:"color",
                field:"MAGNITUDE",
                stops:[{
                    value :0.5,
                    color:"green"
                },
                {
                    value:5,
                    color:"red"
                }
                ]
            },{
                type:"size",
                field:"DEPTH",
                stops:[{
                    value:-2.4,
                    size:5000
                },{
                    value:12.4,
                    size:150000
                }
                ]
            }
        ]
    };
    fl.renderer=simple;
//////////////////////////////////////
    let gl=new GraphicsLayer({});

    let query=fl.createQuery();
    query.where="MAGNITUDE > 4";
    query.outFields=['*'];
    query.returnGeometry=true;

    fl.queryFeatures(query)
    .then(response=>{
        console.log(response);
        getResults(response.features);
    })
    .catch(err=>{
        console.log(err);
    })

    let getResults=(features)=>{
        let symbol={
            label:"magnituda powyżej 4",
            type:"simple-marker",
            size:10,
            color:"blue",
            style:"square"
        };
        features.map(elem=>{
            elem.symbol=symbol
        });
        gl.addMany(features);
    }
    
    map1.addMany([gl,fl]);

    let layerList = new LayerList({
        view: view,
        container: document.createElement("div")
      });
      
      // Add the widget to the top-right corner of the view
      view.ui.add(layerList, {
        position: "top-right"
      });
});

