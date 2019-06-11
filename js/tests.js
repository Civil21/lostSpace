function onKeyDown(event){
	switch(event.which){
		case 27:
		if(menu){
			menu = false;
			document.querySelector("#container").style.display="none";
		}else{
			menu = true;
			document.querySelector("#container").style.display="";
		}			
		break;
	}
}

  //функція визначення координат мишки
var mouse = new THREE.Vector2();

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

//функція опрацювання наведення мишки на об'єкт сцени
var INTERSECTED, raycaster;

function onHover() {
  	raycaster.setFromCamera(mouse, camera);
  	var intersects = raycaster.intersectObjects(scene.children,true );
  	if (intersects.length > 0) {
    	// знайдено обєкт в зоні наведення мишки
    	//console.log("intersect object")
    	if (INTERSECTED != intersects[0].object.parent) {
      		//зміна об'єкту наведення
      		if(intersects[0].object.parent.canSelect){
      			//console.log("INTERSECTED");
      			if (INTERSECTED) {
      				//INTERSECTED.children[0].material.color.setHex( INTERSECTED.currentHex );
      			}
      			INTERSECTED = intersects[0].object.parent;
      			scene.add(selector);
      			selector.position.set(INTERSECTED.position.x,INTERSECTED.position.y,INTERSECTED.position.z);
      			//INTERSECTED.currentHex = INTERSECTED.children[0].material.color.getHex();
				//INTERSECTED.children[0].material.color.setHex( 0x000000 );
			}else{
				if (INTERSECTED) {
      				//INTERSECTED.children[0].material.color.setHex( INTERSECTED.currentHex );
    			}
    			INTERSECTED = null;
    			scene.remove(selector);
			}
    	}
  	} else {
    	if (INTERSECTED) {
      		//INTERSECTED.children[0].material.color.setHex( INTERSECTED.currentHex );
    	}
    	INTERSECTED = null;
    	scene.remove(selector);
  }
}

var menu = true;
var game = {};
function startTest(number){
	menu= false
	document.querySelector("#container").style.display="none";
	document.body.background = "";
	initScene();
	game.var =number;
}

function light(){
	var ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.set(0, 1, 0);
	scene.add(pointLight);
	}

function gridView(){
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial(0x000000);
	for(var i = -size; i<=size; i+=step){
		geometry.vertices.push(new THREE.Vector3(-size,0,i));
		geometry.vertices.push(new THREE.Vector3(size,0,i));

		geometry.vertices.push(new THREE.Vector3(i,0,- size));
		geometry.vertices.push(new THREE.Vector3(i,0,size));
	}
	var plan = new THREE.LineSegments(geometry,material,THREE.LinePieces);
	scene.add(plan);
}

var loadingManager = null;
var RESOURCES_LOADED = false;
const modelsPath = "../models/";
const bigScale =0.15, midelScale =0.1, smallScale =0.05;
var models = {
	earth:{
		obj:"planet.obj",
		mtl: null,
		mesh: null,
		texture: "earthmap.jpg",
		scale: 1
	},
	mars:{
		obj:"planet.obj",
		mtl: null,
		mesh: null,
		texture: "marsmap.png",
		scale: 0.7
	},
	wariorBlue: {
		obj:"warior.obj",
		mtl:null,
		color: [0xffffff,0x000000,0x0000ff,0xffffff],
		scale: 0.15,
		mesh: null
	},
	wariorRed: {
		obj:"warior.obj",
		mtl:null,
		color: [0xffffff,0x000000,0xFF0000,0xffffff],
		scale: 0.15,
		mesh: null
	},
	minerRed: {
		obj:"miner.obj",
		mtl:null,
		color: 0xFF0000,
		scale: 0.3,
		mesh: null
	},
	minerBlue: {
		obj:"miner.obj",
		mtl:null,
		color: 0x0000ff,
		scale: 0.3,
		mesh: null
	},
	asteroidGoldSmall: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x999900,
		texture: "asteroidmap.jpg",
		scale: smallScale,
		mesh: null
	},
	asteroidGoldMidel: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x999900,
		texture: "asteroidmap.jpg",
		scale: midelScale,
		mesh: null
	},
	asteroidGoldBig: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x999900,
		texture: "asteroidmap.jpg",
		scale: bigScale,
		mesh: null
	},
	asteroidGoldFastSmall:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xffdd00,
		texture: "asteroidmap.jpg",
		scale: smallScale,
		mesh: null
	},
	asteroidGoldFastMidel:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xffdd00,
		texture: "asteroidmap.jpg",
		scale: midelScale,
		mesh: null
	},
	asteroidGoldFastBig:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xffdd00,
		texture: "asteroidmap.jpg",
		scale: bigScale,
		mesh: null
	},
	asteroidSilverSmall: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x808080,
		texture: "asteroidmap.jpg",
		scale: smallScale,
		mesh: null
	},
	asteroidSilverMidel: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x808080,
		texture: "asteroidmap.jpg",
		scale: midelScale,
		mesh: null
	},
	asteroidSilverBig: {
		obj:"asteroid.obj",
		mtl:null,
		color: 0x808080,
		texture: "asteroidmap.jpg",
		scale: bigScale,
		mesh: null
	},
	asteroidSilverFastSmall:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xC0C0C0,
		texture: "asteroidmap.jpg",
		scale: smallScale,
		mesh: null
	},
	asteroidSilverFastMidel:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xC0C0C0,
		texture: "asteroidmap.jpg",
		scale: midelScale,
		mesh: null
	},
	asteroidSilverFastBig:{
		obj:"asteroid.obj",
		mtl:null,
		color: 0xC0C0C0,
		texture: "asteroidmap.jpg",
		scale: bigScale,
		mesh: null
	}
};
const size =30, step = 10;
var meshes = {};
var scene,control,camera,renderer;
var selector;
function initScene()
{
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

		loadingManager = new THREE.LoadingManager();
		loadingManager.onProgress = function(item, loaded, total){
			console.log(item, loaded, total);
		};
		loadingManager.onLoad = function(){
			console.log("loaded all resources");
			RESOURCES_LOADED = true;
			onResourceLoad();
					};

		gridView();
		light();

		selector = new THREE.Mesh( new THREE.TorusGeometry( 5, 0.3, 2, 32 ), new THREE.MeshBasicMaterial( { color: 0x990000 } ) );
		selector.rotation.x =3.14/2;
		  raycaster = new THREE.Raycaster();

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth,window.innerHeight);
		document.body.appendChild(renderer.domElement);
		control=new THREE.OrbitControls(camera,renderer.domElement);
		camera.position.set(0,30,0);

	for( var _key in models ){
		(function(key){
			if(models[key].mtl != null){
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(modelsPath+models[key].mtl, function(materials){
				materials.preload();
				var objLoader = new THREE.OBJLoader(loadingManager);
				objLoader.setMaterials(materials);
				objLoader.load(modelsPath+models[key].obj, function(mesh){
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					if(models[key].scale){
						mesh.scale.set(models[key].scale,models[key].scale,models[key].scale);
					}
					mesh.name = key;
					models[key].mesh = mesh;		
				});
			});
		}else{

			var objLoader = new THREE.OBJLoader(loadingManager);
			objLoader.load(modelsPath+models[key].obj, function ( mesh ) {
				mesh.traverse(function(node){
					if( node instanceof THREE.Mesh ){
						node.castShadow = true;
						node.receiveShadow = true;
						if(node.material.length){
							for(var i=0;i<node.material.length;i++){
								node.material[i].color.setHex(models[key].color[i]);
							}
						}else{
										if(models[key].texture){
							node.material.map= new THREE.TextureLoader().load( "../images/"+models[key].texture );
						}
							if(models[key].color){
							node.material.color.setHex(models[key].color);
						}
						}
			
					}
				});
				if(models[key].scale){
					mesh.scale.set(models[key].scale,models[key].scale,models[key].scale);
				}
				mesh.name = key;
				models[key].mesh = mesh;
			});
		}
	})(_key);
	}

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeyDown,false);
	window.addEventListener('mousemove', onMouseMove, false);
	
	animate();
}

function setPosition(object,x=0,z=0){
	object.position.set(step*(x-size/step+0.5),0,step*(z-size/step+0.5));
}

var plans = [];
function addPlans(station){
	if(station.isStation){

		var plan = models.SmallSpaceFighter.mesh.clone();

		plan.position.set(station.position.x,station.position.y+1,station.position.z);
		plan.player = station.player;
		plan.material.color.setHex(0xff7788);
	}else{
		console.log("This object not station, is"+station.name)
	}
}
asteroids = [];

function addAsteroid(material,speed,size,x,y){
	var asteroid = null;
	switch(""+material+speed+size){
		case "000":
		asteroid = models["asteroidGoldSmall"].mesh.clone();
		break;
		case "001":
		asteroid = models["asteroidGoldMidel"].mesh.clone();
		break;
		case "002":
		asteroid = models["asteroidGoldBig"].mesh.clone();
		break;
		case "010":
		asteroid = models["asteroidGoldFastSmall"].mesh.clone();
		break;
		case "011":
		asteroid = models["asteroidGoldFastMidel"].mesh.clone();
		break;
		case "012":
		asteroid = models["asteroidGoldFastBig"].mesh.clone();
		break;
		case "100":
		asteroid = models["asteroidSilverSmall"].mesh.clone();
		break;
		case "101":
		asteroid = models["asteroidSilverMidel"].mesh.clone();
		break;
		case "102":
		asteroid = models["asteroidSilverBig"].mesh.clone();
		break;
		case "110":
		asteroid = models["asteroidSilverFastSmall"].mesh.clone();
		break;
		case "111":
		asteroid = models["asteroidSilverFastMidel"].mesh.clone();
		break;
		case "112":
		asteroid = models["asteroidSilverFastBig"].mesh.clone();
		break;
	}
	//console.log(asteroid.name+" create");
	asteroid.canSelect= true;
	//console.log(asteroid.canSelect)
	setPosition(asteroid,x,y);
	asteroids.push(asteroid);
	scene.add(asteroid);
	return asteroid;
}
var earth,mars;
function addPlanet(command,x,y){
	var planet;
	switch(command){
		case 0:
			planet  = models.earth.mesh.clone();
			earth = planet;
		break;
		case 1: 
			planet = models.mars.mesh.clone();
			mars = planet;
		break;
	}
	planet.canSelect= true;
	setPosition(planet,x,y);
	scene.add(planet);
	return planet;
}

//перегенерує вікно перегляду при зміні розміру вікна
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onResourceLoad(){
	if(RESOURCES_LOADED){
		switch(game.var){
			case 1:
				test1();
			break;
			case 2:
				test2();
			break;
			case 3:
				test3();
			break;
		}
	}	
}

function test1(){
	
	meshes["w1"] = models.wariorRed.mesh.clone();
	scene.add(meshes["w1"]);
	setPosition(meshes["w1"],0,3);
	meshes["w2"] = models.wariorBlue.mesh.clone();
	scene.add(meshes["w2"]);
	setPosition(meshes["w2"],0,4);
	meshes["m1"] = models.minerRed.mesh.clone();
	scene.add(meshes["m1"]);
	setPosition(meshes["m1"],1,3);
	meshes["m2"] = models.minerBlue.mesh.clone();
	scene.add(meshes["m2"]);
	setPosition(meshes["m2"],1,4);

	addPlanet(0,2,4);
	addPlanet(1,2,3);
	
	
	addAsteroid(0,0,0,0,0);
	addAsteroid(0,0,1,0,1);
	addAsteroid(0,0,2,0,2);
	addAsteroid(0,1,0,1,0);
	addAsteroid(0,1,1,1,1);
	addAsteroid(0,1,2,1,2);
	addAsteroid(1,0,0,2,0);
	addAsteroid(1,0,1,2,1);
	addAsteroid(1,0,2,2,2);
	addAsteroid(1,1,0,3,0);
	addAsteroid(1,1,1,3,1);
	addAsteroid(1,1,2,3,2);
	
}

function test2(){
		meshes["w1"] = models.wariorRed.mesh.clone();
	scene.add(meshes["w1"]);
	setPosition(meshes["w1"],0,3);
	meshes["w2"] = models.wariorBlue.mesh.clone();
	scene.add(meshes["w2"]);
	setPosition(meshes["w2"],0,4);
	meshes["m1"] = models.minerRed.mesh.clone();
	scene.add(meshes["m1"]);
	setPosition(meshes["m1"],1,3);
	meshes["m2"] = models.minerBlue.mesh.clone();
	scene.add(meshes["m2"]);
	setPosition(meshes["m2"],1,4);
	
	addPlanet(0,2,4);
	addPlanet(1,2,3);
	
	
	addAsteroid(0,0,0,0,0);
	addAsteroid(0,0,1,0,1);
	addAsteroid(0,0,2,0,2);
	addAsteroid(0,1,0,1,0);
	addAsteroid(0,1,1,1,1);
	addAsteroid(0,1,2,1,2);
	addAsteroid(1,0,0,2,0);
	addAsteroid(1,0,1,2,1);
	addAsteroid(1,0,2,2,2);
	addAsteroid(1,1,0,3,0);
	addAsteroid(1,1,1,3,1);
	addAsteroid(1,1,2,3,2);

}

function test3(){
		addAsteroid(0,0,2,0,2);
	console.log(asteroids[0]);
}

function animate(){
	requestAnimationFrame(animate);
	
	if( RESOURCES_LOADED == false ){
		
		return;
	}
	
	  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
  onHover();
  control.update();

   //перевірка наведення
	
	renderer.render(scene,camera);
}