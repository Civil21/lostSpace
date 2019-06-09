var menu = true;
function startTest(number){
	menu= false
	document.querySelector("#container").style.display="none";
	document.body.background = "";
	initScene();
	gridView(200,10);
	switch(number){
		case 1:
			test1();
		break;
		case 2:
			test2();
			objects[0].orbitreload();
		break;
		case 3:
			test3();
		break;
	}
	light();
	animate();
}

var scene,control,camera,renderer;
function initScene()
{
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth,window.innerHeight);
		document.body.appendChild(renderer.domElement);
		control=new THREE.OrbitControls(camera,renderer.domElement);
		camera.position.set(0,30,0);
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeyDown,false);
		loadPlan();
}

//перегенерує вікно перегляду при зміні розміру вікна
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

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


function test1(){
	
	for(var i = 0; i<5; i++){
	addPlan(10*i,0,10*i);

	}
}
var planObject;
function loadPlan(){
			console.log("Load plan object");
			planObject = objLoader.load( 
	 		'../models/plan.obj', 
	 		function ( object ) {
				object.traverse( function ( child ) {
            		if ( child instanceof THREE.Mesh ) {
                		child.material.color.setHex(0x00FF00);  
    	        	}
        		} );
        		//object.position.set(x,y,z);
				//object.player=1;
				//arr.push(object)
				object.scale.set(0.5,0.5,0.5);
				//scene.add( object );
				
				return object;
			}
		);
}

var objLoader = new THREE.OBJLoader()
function addPlan(arr,x =0,y=0,z=0){
	var plan = planObject.clone();
		plan.position.set(x,y,z);
		arr.push(plan);
		plan.player= 1;

		scene.add(plan); 	
}
var plans= [];
plans.find = function(field,variable){
	var arr = [];
	console.log(plans.length);
	for(var i = 0;i<plans.length;i++){
		console.log(plans[i][field]);
		if(plans[i][field]==variable){
			arr.push(plans[i]);
		}
	}
	return arr ;
}
var objects = [];
var objectSize = 5;
function addObject(x,y,z){
	var material, geometry;
  	material = new THREE.MeshBasicMaterial({color: 0xffffff});
  	geometry = new THREE.SphereGeometry(objectSize, 32, 32);
  	object = new THREE.Mesh(geometry, material);
  	object.position.set(x,y,z);
  	console.log("create object");
  	object.orbitreload = function() {
  		var arr = plans.find("player",1);
  		console.log(arr);
    	for (var i = 0; i < arr.length; i++) {
      		x = (2 * 3.14 / arr.length) * (i + 1);
      		arr[i].position.set(object.position.x+objectSize*1.4 * Math.cos(x), object.position.y, object.position.z+ objectSize*1.4* Math.sin(x));
      		arr[i].rotation.y= x;
    	}
	};
    scene.add(object);
    objects.push(object);
}

function test2(){
	//var plans = [];
	for(var i = 0; i<5; i++){
		plans.push(addPlan(plans));
	}
	addObject(0,0,0);
}

function test3(){
	var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load("../models/A2.mtl", function(materials){

        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load("../models/A2.obj", function(mesh36){

            mesh36.traverse(function(node){
                if( node instanceof THREE.Mesh ){
                    node.castShadow = false;
                    node.receiveShadow = false;
                }
            });

            scene.add(mesh36);
        });

    });
}


function gridView(size,step){
	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial(0x000000);
	for(var i = -size; i<=size; i+=step){
		geometry.vertices.push(new THREE.Vector3(-size,0,i));
		geometry.vertices.push(new THREE.Vector3(size,0,i));

		geometry.vertices.push(new THREE.Vector3(i,0,- size));
		geometry.vertices.push(new THREE.Vector3(i,0,size));
	}
	var plan = new THREE.Line(geometry,material,THREE.LinePieces);
	scene.add(plan);
}

function light(){
	var ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.set(0, 1, 0);
	scene.add(pointLight);
	}


function animate(){
	requestAnimationFrame(animate);
	control.update();
	
	renderer.render(scene,camera);

}