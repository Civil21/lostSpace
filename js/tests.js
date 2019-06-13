function onKeyDown(event){
	switch(event.which){
		case 27:
		if(menu){
			menu = false;
			game.play =true
			document.querySelector("#container").style.display="none";
		}else{
			menu = true;
			game.play = false
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
    	if (INTERSECTED != intersects[0].object.parent) {
      		//зміна об'єкту наведення
      		if(intersects[0].object.parent.canSelect){
      			if (INTERSECTED) {
      			}
      			INTERSECTED = intersects[0].object.parent;
      			scene.add(selector);
      			selector.position.set(INTERSECTED.position.x,INTERSECTED.position.y,INTERSECTED.position.z);
			}else{
				if (INTERSECTED) {
    			}
    			INTERSECTED = null;
    			scene.remove(selector);
			}
    	}
  	} else {
    	if (INTERSECTED) {

    	}
    	INTERSECTED = null;
    	scene.remove(selector);
  }
}

function selectFloatPlan(group,locFloat){
	console.log(group);
		var arr = [];
		group.forEach(function(plan){
			if(plan.float==locFloat)arr.push(plan)
		});
		return arr;
}
var floats = [];
var float = {
	num: null,
	station: null,
}
var arm = {
	num: null,
	station: null,
}
setInterval(function(){
	if(false&& game.play){
		console.log("I ALIVE");
		if(redPlayer.silver>=redPlayer.minerCost()){
			addMiner(redPlayer);
			return ;
		}
		if(redPlayer.gold>=redPlayer.wariorCost()){
			addWarior(redPlayer);
			return ;
		}
	}
},100);
var floatNum = null

function selectPlanToFloat(locFloat,plan){
	
	if(locFloat.num == null){
		locFloat.num = floats.length;
		locFloat.station = plan.station;
		locFloat.position = {x:locFloat.station.position.x, y:locFloat.station.position.y+5,z:locFloat.station.position.z};
	}
	plan.float = locFloat.num;
	plan.station = null;
	floatPlanPosition(locFloat);
}

function floatPlans(locFloat){
	var arr = [];

	selectFloatPlan(miners,locFloat.num).forEach(function(miner){
		arr.push(miner);
	});
	selectFloatPlan(wariors,locFloat.num).forEach(function(warior){
		arr.push(warior);
	});
	return arr;
}
function floatPlanPosition(locFloat){
	console.log("iTS WORK? 	")
	var plans = floatPlans(locFloat)
	//console.log(plans);
	var cal = 1;
	if(plans.length>1) cal++;
	if(plans.length>4) cal++;
	if(plans.length>9) cal++;
	if(plans.length>16) cal++;
	if(plans.length>25) cal++;
	var x = 0,y=0;
	var r = cal-1;
	var c = (plans.length-plans.length%cal+cal)/cal-1;
	//console.log("r:"+r+" c:"+c);
	for(var i =0 ;i<plans.length;i++){
		var plan = plans[i];

		if(y>=cal){
			y=0;
			x++;
			if(plans.length-x*cal<cal){
				r=plans.length-x*cal;
			}else{
				r=cal;
			}
			//console.log("r:"+r+" c:"+c);
		}
		//console.log("position.x:"+(x*2)+" - "+(c));
		//console.log("position.z:"+(y*2)+" - "+(r));
		plan.target.set(locFloat.position.x+x*2-c/2,locFloat.position.y,locFloat.position.z+y*2-r/2);
		//console.log(plan.target);
		//console.log("i("+x+") j("+y+")");
		y++;
	}
	
}
function removeFloat(locFloat){
	locFloat.station.player = floatPlans(locFloat)[0].player;
	floatPlans(locFloat).forEach(function(plan){
		plan.station = locFloat.station;
		plan.float = null;
	});
	//selectStationPlan().forEach();
	
}
function targetFloat(locFloat, target){
	locFloat.station = target;
	var x,y,z,l,t;	
	x = target.position.x - locFloat.position.x;
    y = target.position.y+5 - locFloat.position.y;
    z = target.position.z - locFloat.position.z;
    l = Math.abs(Math.sqrt(x * x + y * y + z * z));
    //console.log(t)
    t = l / 1;
    locFloat.run =  setInterval(function(){
    	locFloat.position.x +=x/t;
    	//locFloat.position.y +=y/t;
    	locFloat.position.z +=z/t;
    	floatPlanPosition(locFloat);
    	console.log(Math.abs(z/t));
    	if (Math.abs(locFloat.position.z - locFloat.station.position.z) <= Math.abs(z/t) &&
        	Math.abs(locFloat.position.x - locFloat.station.position.x) <= Math.abs(x/t)) {
        	clearInterval(locFloat.run);
        	//console.log("finish float");
        	removeFloat(locFloat);
      	}
    },100);
   
	floats.push(locFloat);
	float = {
	num: null,
	station: null,
	}
}
//var selectSpaceObject = null
function onClick(event){
  	//console.log(event.button);
	//console.log(event.which);
	if(INTERSECTED){
		//console.log(float.station != null && float.station != INTERSECTED && INTERSECTED.canSelect);
		if(float.station != null && float.station != INTERSECTED && INTERSECTED.canSelect){
			targetFloat(float, INTERSECTED);
			return;
		}
		if(INTERSECTED.player == bluePlayer){
		//console.log(float);
		//selectSpaceObject = INTERSECTED
			switch(event.button){
				case 0: 
					if(INTERSECTED.miners().length>0){
						selectPlanToFloat(float,INTERSECTED.miners()[0]);
						console.log(floatPlans(float));
					}
				break;
				case 1:
					removeFloat(float);
				break;
				case 2:
					if(INTERSECTED.wariors().length>0){
						selectPlanToFloat(float,INTERSECTED.wariors()[0]);
					}
				break;
			}
		}
	}
	/*
	if(INTERSECTED && INTERSECTED.isStation){
		addWarior(bluePlayer);
	}
	*/
}

var menu = true;
var game = {};
function startTest(number){
	menu= false
	document.querySelector("#container").style.display="none";
	document.body.background = "";
	console.log()
	document.querySelector("#activMenu").style.display="block";
	initScene();
	game.play = true;
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
function initScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		//console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourceLoad();
	};
	scene.background = new THREE.TextureLoader(loadingManager).load('../images/maxresdefault.jpg');
	gridView();
	light();

	selector = new THREE.Mesh( new THREE.TorusGeometry( 5, 0.3, 2, 32 ), new THREE.MeshBasicMaterial( { color: 0x000099 } ) );
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
	document.onmousedown =onClick
	
	animate();
}

function setPosition(object,x=0,z=0){
	object.position.set(step*(x-size/step+0.5),0,step*(z-size/step+0.5));
}

//var plans = [];
var wariors = [];
var miners = [];
function addMiner(player){
	if(player.silver>=player.minerCost()){
		player.silver -= player.minerCost();
		var plan;
		switch(player){
			case redPlayer:
				plan = models.minerRed.mesh.clone();
			break;
			case bluePlayer:
				plan = models.minerBlue.mesh.clone();
			break;
		}
		plan.player = player;
		addPlan(plan,player.planet);
		miners.push(plan);
	}else{
		console.log('NEED MANY SILVER')
	}
}
function addWarior(player){
	//console.log(player.gold);
	//console.log(player.wariorCost());
	if(player.gold>=player.wariorCost()){
		player.gold -= player.wariorCost();
		var plan;
		switch(player){
			case redPlayer:
				plan = models.wariorRed.mesh.clone();
			break;
			case bluePlayer:
				plan = models.wariorBlue.mesh.clone();
			break;
		}
		plan.player = player;
		addPlan(plan,player.planet);
		wariors.push(plan)
	}else{
		console.log('NEED MANY GOOLD')
	}
}
function addPlan(plan, planet){
		//console.log(planet.position);
		plan.position.set(planet.position.x,planet.position.y+5,planet.position.z);
		plan.target = {x:0, y:0,z:0};
		plan.target.set = function(x,y,z){
			plan.target.x = x;
			plan.target.y = y;
			plan.target.z = z;
		}
		plan.run = setInterval(function() {
			var position = {
				x:plan.position.x,
				y:plan.position.y,
				z:plan.position.z
			};

			if(Math.abs(position.x-plan.target.x)>0.1)
				if(position.x-plan.target.x<0){position.x+=0.05}else{position.x-=0.05}
			if(Math.abs(plan.position.y-plan.target.y)>0.1)
				if(position.y-plan.target.y<0){position.y+=0.05}else{position.y-=0.05}
			if(Math.abs(position.z-plan.target.z)>0.1)		
				if(position.z-plan.target.z<0){position.z+=0.05}else{position.z-=0.05}
			plan.lookAt(position.x+plan.target.x*1000,position.y+plan.target.y*100,position.z+plan.target.z*1000);
			//console.log(position.x+plan.target.x*1000,position.y+plan.target.y*100,position.z+plan.target.z*1000);
			plan.position.set(position.x,position.y,position.z);

      }, 1);
		plan.station = planet;
		//console.log(plan.position);
		//plans.push(plan);
		scene.add(plan)
}
function spaceObject(){
	var arr = [];
	asteroids.forEach(function(asteroid){
		arr.push(asteroid);
	});
	arr.push(bluePlayer.planet);
	arr.push(redPlayer.planet);
	return arr;
} 
var asteroids = [];

function selectStationPlan(group,station){
		var arr = [];
		group.forEach(function(plan){
			if(plan.station == station) arr.push(plan);
		});
		return arr;
}

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
	asteroid.wariors = function(){return selectStationPlan(wariors,asteroid)};
	asteroid.miners = function(){return selectStationPlan(miners,asteroid)};
	asteroid.canSelect= true;
	asteroid.material=material;
	asteroid.speed=speed;
	asteroid.workCount = size*2;
	setPosition(asteroid,x,y);
	asteroid.rotation.set(Math.random()*360,Math.random()*360,Math.random()*360);
	setInterval(function() {
		//console.log("SEARCH MINER");
		if(asteroid.player && game.play){
			switch(material){
				case 0: 
					//console.log("SEARCH GOLD MINER");
					if(asteroid.miners().length<=asteroid.workCount){
						asteroid.player.gold += asteroid.miners().length*(asteroid.speed+1)
					}else{
						asteroid.player.gold += asteroid.workCount*(asteroid.speed+1);
					}
					
					break;
				case 1:
					//console.log("SEARCH SILVER MINER");
					if(asteroid.miners().length<=asteroid.workCount){
						asteroid.player.silver += asteroid.miners().length*(asteroid.speed+1)
					}else{
						asteroid.player.silver += asteroid.workCount*(asteroid.speed+1);
					}
				break;
			}
		}
    }, 1000);
	asteroids.push(asteroid);
	scene.add(asteroid);
	return asteroid;
}

function addPlanet(command,x,y){
	var planet;
	switch(command){
		case 0:
			planet  = models.earth.mesh.clone();
			planet.player = bluePlayer;
			bluePlayer.planet = planet;
		break;
		case 1: 
			planet = models.mars.mesh.clone();
			planet.player = redPlayer;
			redPlayer.planet = planet;
		break;
	}
	planet.wariors = function(){return selectStationPlan(wariors,planet)};
	planet.miners = function(){return selectStationPlan(miners,planet)};
	planet.isStation = true;
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
function selectPlan(group,player){
		var arr = [];
		group.forEach(function(plan){
			if(plan.player==player)arr.push(plan)
		});
		return arr;
}

var redPlayer={
	name: "red",
	silver: 0,
	miners: function(){return selectPlan(miners,redPlayer);},
	minerCost: function(){return redPlayer.miners().length*2},
	gold: 8,
	wariors: function(){return selectPlan(wariors,redPlayer);},
	wariorCost: function(){return 3+redPlayer.wariors().length*3},
};
var bluePlayer={
	name: "blue",
	silver: 100,
	miners: function(){return selectPlan(miners,bluePlayer);},
	minerCost: function(){return bluePlayer.miners().length*2},
	gold: 100,
	wariors: function(){return selectPlan(wariors,bluePlayer);},
	wariorCost: function(){return 3+bluePlayer.wariors().length*3},
};

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
	addPlanet(1,3,2);
	addPlanet(0,3,3);
	//addWarior(bluePlayer);
	addAsteroid(1,1,2,3,0);
	addAsteroid(1,1,2,2,5);

}

function test3(){
		addAsteroid(0,0,2,0,2);
	//console.log(asteroids[0]);
}
var angle = 0;
function animate(){
	requestAnimationFrame(animate);
	
	if( RESOURCES_LOADED == false ){
		
		return;
	}

	if(game.play){
		document.getElementById("silverCount").innerText = bluePlayer.silver;
		document.getElementById("goldCount").innerText = bluePlayer.gold;
	}

	asteroids.forEach(function(asteroid){
		asteroid.rotation.z+=0.005;
		asteroid.rotation.y+=0.005;
	});

	spaceObject().forEach(function(station){
		//console.log(station.position);
		for (var i = 0; i < station.wariors().length; i++) {
			var warior = station.wariors()[i];
      		var x = (2 * 3.14 / station.wariors().length) * (i + 1);
      		warior.target.set(station.position.x+5 * Math.cos(x+(angle/360)*2*3.14), 0, station.position.z+5 * Math.sin(x+(angle/360)*2*3.14));
    	}
	
		for (var i = 0; i < station.miners().length; i++) {
			var miner = station.miners()[i];
      		var x = (2 * 3.14 / station.miners().length) * (i + 1);
      		miner.target.set(station.position.x+4 * Math.cos(x+(angle/360)*2*3.14),0, station.position.z+4 * Math.sin(x+(angle/360)*2*3.14));
    	}
	});

	
	camera.lookAt(scene.position);
 	camera.updateMatrixWorld();
  	onHover();
  	control.update();

   //перевірка наведення
	angle+=1;
	if(angle>=360)angle =0;
	renderer.render(scene,camera);
}