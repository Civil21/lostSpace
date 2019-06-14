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

var menu = true;
var game = {};
function startMap(number){
	if(RESOURCES_LOADED){
	menu= false
	document.querySelector("#container").style.display="none";
	document.body.background = "";
	document.querySelector("#activMenu").style.display="block";
	initScene();
	
			switch(number){
			case 1:
				map1();
			break;
			case 2:
				map2();
			break;
			case 3:
				map3();
			break;
		}
	
		game.play = true;
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
      			INTERSECTED = intersects[0].object.parent;
      			scene.add(selector);
      			selector.position.set(INTERSECTED.position.x,INTERSECTED.position.y,INTERSECTED.position.z);
			}else{
    			INTERSECTED = null;
    			scene.remove(selector);
			}
    	}
  	} else {
    	INTERSECTED = null;
    	scene.remove(selector);
  }
}

function onClick(event){
	if(INTERSECTED){
		if(floats[bluePlayer.float].station != null && floats[bluePlayer.float].station != INTERSECTED && INTERSECTED.canSelect){
			targetFloat(floats[bluePlayer.float], INTERSECTED);
			return;
		}
		if(INTERSECTED.player == bluePlayer){
			switch(event.button){
				case 0: 
					if(INTERSECTED.miners().length>0)
						addPlanToFloat(INTERSECTED.miners()[0]);
				break;
				case 1:
					removeFloat(float);
				break;
				case 2:
					if(INTERSECTED.wariors().length>0)
						addPlanToFloat(INTERSECTED.wariors()[0]);
				break;
			}
		}
	}
}

var loadingManager = null;
var RESOURCES_LOADED = false;
const modelsPath = "models/";
const bigScale =0.15, midelScale =0.1, smallScale =0.05;
var models = {
	earth:{
		obj:"planet.obj",
		mtl: null,
		mesh: null,
		texture: "earth.jpg",
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

function beforeInite(){
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
	};
	loadingManager.onLoad = function(){
		RESOURCES_LOADED = true;
		onResourceLoad();
	};
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
			objLoader.load(modelsPath+models[key].obj, function(mesh) {
				mesh.traverse(function(node){
					if(node instanceof THREE.Mesh){
						node.castShadow = true;
						node.receiveShadow = true;
						if(node.material.length){
							for(var i=0;i<node.material.length;i++){
								node.material[i].color.setHex(models[key].color[i]);
							}
						}else{
							if(models[key].texture){
							node.material.map= new THREE.TextureLoader().load( "images/"+models[key].texture );
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
}

var floats = [];
setInterval(function(){
	if(true&& game.play){
		if(redPlayer.silver>=redPlayer.minerCost()){
			addMiner(redPlayer);
			return ;
		}
		if(redPlayer.gold>=redPlayer.wariorCost()){
			addWarior(redPlayer);
			return ;
		}
	}
	asteroids.forEach(function(asteroid){
		if(asteroid.player == null || asteroid.player == redPlayer){
			var arr = selectStationPlan(miners,redPlayer.planet);
			for(var i=0;i<Math.min(arr.length,asteroid.workCount-selectStationPlan(miners,asteroid).length);i++){
				addPlanToFloat(selectStationPlan(miners,redPlayer.planet)[0]);
			}
		}
		if(asteroid.player == bluePlayer && strongStation(asteroid)<strongStation(redPlayer.planet)){
			while(selectStationPlan(wariors,redPlayer.planet).length+selectStationPlan(miners,redPlayer.planet).length>0){
				if(strongStation(asteroid)<strongFloat(floats[redPlayer.float])){
					break;
				}
				if(selectStationPlan(wariors,redPlayer.planet).length>0){
					addPlanToFloat(selectStationPlan(wariors,redPlayer.planet)[0]);
					continue;
				}
				if(selectStationPlan(miners,redPlayer.planet).length>0){
					addPlanToFloat(selectStationPlan(miners,redPlayer.planet)[0]);
					continue;
				}
			}
		}
		if(floatPlans(floats[redPlayer.float]).length>0){
			targetFloat(floats[redPlayer.float],asteroid);
		}
	});
},100);

function strongFloat(locFloat){
	return selectFloatPlan(miners,locFloat)+selectFloatPlan(wariors,locFloat)*2;
}

function selectFloatPlan(group,locFloat){
	var arr = [];
	group.forEach(function(plan){
		if(plan.float==locFloat)arr.push(plan)
	});
	return arr;
}

function addPlanToFloat(plan){

	locFloat = floats[plan.player.float]
	if(locFloat.station == null){
		locFloat.station = plan.station;
		locFloat.position = {x:locFloat.station.position.x, y:locFloat.station.position.y+5,z:locFloat.station.position.z};
	}
	plan.float = locFloat.num;
	plan.station = null;
	floatPlanPosition(locFloat);
}

function floatPlans(locFloat){
	if(locFloat){
		var arr = [];
		selectFloatPlan(miners,locFloat.num).forEach(function(miner){
			arr.push(miner);
		});
		selectFloatPlan(wariors,locFloat.num).forEach(function(warior){
			arr.push(warior);
		});
		return arr;
	}
}
function floatPlanPosition(locFloat){
	var plans = floatPlans(locFloat)
	var cal = 1;
	if(plans.length>1) cal++;
	if(plans.length>4) cal++;
	if(plans.length>9) cal++;
	if(plans.length>16) cal++;
	if(plans.length>25) cal++;
	var x = 0,y=0;
	var r = cal-1;
	var c = (plans.length-plans.length%cal+cal)/cal-1;
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
		}
		plan.target.set(locFloat.position.x+x*2-c/2,locFloat.position.y,locFloat.position.z+y*2-r/2);
		y++;
	}
}

function deletePlanToGroup(group,planGroup){
	group.slice(group.indexOf(planGroup[0]),1);
	planGroup[0].destroy();
	planGroup.shift();
}

function removeFloat(locFloat){
	if(locFloat.station.player !=floatPlans(locFloat)[0].player){
		var ms1 =selectStationPlan(miners,locFloat.station);
		var ms2 =selectFloatPlan(miners,locFloat.num);
		for(var i=0;i<Math.min(ms1.length,ms2.length);){
			deletePlanToGroup(miners,ms1);
			deletePlanToGroup(miners,ms2);
		}
		var ws1 =selectStationPlan(wariors,locFloat.station);
		var ws2 =selectFloatPlan(wariors,locFloat.num);
		for(var i=0;i<Math.min(ws1.length,ws2.length);){
			deletePlanToGroup(wariors,ws1);
			deletePlanToGroup(wariors,ws2);
		}
		if(ms1.length>0 && ws2.length>0){
			for(var i=0;i<Math.min(ms1.length,ws2.length);){
				if(ms1.length==1){
					deletePlanToGroup(miners,ms1);
				}else{
					deletePlanToGroup(miners,ms1);
					deletePlanToGroup(miners,ms1);
					deletePlanToGroup(wariors,ws2);
				}
			}
		}
		if(ms2.length>0 && ws1.length>0){
			for(var i=0;i<Math.min(ms2.length,ws1.length);){
				if(ms2.length==1){
					deletePlanToGroup(miners,ms2);
				}else{
					deletePlanToGroup(miners,ms2);
					deletePlanToGroup(miners,ms2);
					deletePlanToGroup(wariors,ws1);
				}
			}
		}
	}
	if(floatPlans(locFloat).length>0){
		locFloat.station.player =floatPlans(locFloat)[0].player
		floatPlans(locFloat).forEach(function(plan){
			plan.station = locFloat.station;
			plan.float = null;
		});
	}

}

function targetFloat(locFloat, target){
	var newFloat = new Object();
	newFloat.num = floats.length;
	newFloat.station = null;
	locFloat.station.player.float = newFloat.num;
	floats.push(newFloat);
	locFloat.station = target;
	var x,y,z,l,t;	
	x = target.position.x - locFloat.position.x;
    y = target.position.y+5 - locFloat.position.y;
    z = target.position.z - locFloat.position.z;
    l = Math.abs(Math.sqrt(x * x + y * y + z * z));
    t = l / 1;
    locFloat.run =  setInterval(function(){
    	locFloat.position.x +=x/t;
    	locFloat.position.z +=z/t;
    	floatPlanPosition(locFloat);
    	if (Math.abs(locFloat.position.z - locFloat.station.position.z) <= Math.abs(z/t) &&
        	Math.abs(locFloat.position.x - locFloat.station.position.x) <= Math.abs(x/t)) {
        	clearInterval(locFloat.run);
        	removeFloat(locFloat);
      	}
    },100);
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


const size =30, step = 10;
var scene,control,camera,renderer;
var selector;
function initScene(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	scene.background = new THREE.TextureLoader().load('images/maxresdefault.jpg');
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
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeyDown,false);
	window.addEventListener('mousemove', onMouseMove, false);
	document.onmousedown =onClick
	animate();
}

function setPosition(object,x=0,z=0){
	object.position.set(step*(x-size/step+0.5),0,step*(z-size/step+0.5));
}

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
	}
}
function addWarior(player){
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
		wariors.push(plan);
	}
}

function addPlan(plan, planet){
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
			if(position.x-plan.target.x<0){plan.position.x+=0.05}else{plan.position.x-=0.05}
		if(Math.abs(plan.position.y-plan.target.y)>0.1)
			if(position.y-plan.target.y<0){plan.position.y+=0.05}else{plan.position.y-=0.05}
		if(Math.abs(position.z-plan.target.z)>0.1)		
			if(position.z-plan.target.z<0){plan.position.z+=0.05}else{plan.position.z-=0.05}
		plan.lookAt(position.x,position.y,position.z);
    }, 1);
    plan.player = planet.player;
	plan.station = planet;
	plan.destroy = function(){
		plan.float = null;
		plan.station = null;
		plan.player = null;
		scene.remove(plan);
	}
	scene.add(plan)
}

function spaceObject(){
	var arr = [];
	asteroids.forEach(function(asteroid){
		arr.push(asteroid);
	});
	if(bluePlayer.planet)arr.push(bluePlayer.planet);
	if(redPlayer.planet)arr.push(redPlayer.planet);
	return arr;
} 

function strongStation (station){
	return selectStationPlan(miners,station).length+selectStationPlan(wariors,station).length*2
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
		if(asteroid.player && game.play){
			switch(material){
				case 0: 
					if(asteroid.miners().length<=asteroid.workCount){
						asteroid.player.gold += asteroid.miners().length*(asteroid.speed+1)
					}else{
						asteroid.player.gold += asteroid.workCount*(asteroid.speed+1);
					}
					
					break;
				case 1:
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
	silver: 4,
	miners: function(){return selectPlan(miners,redPlayer);},
	minerCost: function(){return redPlayer.miners().length*2},
	gold: 10,
	wariors: function(){return selectPlan(wariors,redPlayer);},
	wariorCost: function(){return 3+redPlayer.wariors().length*3},
	float: 0,
};
floats.push({num:0,station:null});
var bluePlayer={
	name: "blue",
	silver: 10,
	miners: function(){return selectPlan(miners,bluePlayer);},
	minerCost: function(){return bluePlayer.miners().length*2},
	gold: 3,
	wariors: function(){return selectPlan(wariors,bluePlayer);},
	wariorCost: function(){return 3+bluePlayer.wariors().length*3},
	float: 1,
};
floats.push({num:1,station:null});
function map1(){
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

function map2(){	
	addPlanet(1,3,2);
	addPlanet(0,3,3);
	addAsteroid(1,1,2,3,0);
	addAsteroid(1,1,2,2,5);
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
		document.getElementById("minerCost").innerText = bluePlayer.minerCost();
		document.getElementById("wariorCost").innerText = bluePlayer.wariorCost();
	}
	asteroids.forEach(function(asteroid){
		asteroid.rotation.z+=0.005;
		asteroid.rotation.y+=0.005;
	});
	spaceObject().forEach(function(station){
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
	angle+=1;
	if(angle>=360)angle =0;
	renderer.render(scene,camera);
}