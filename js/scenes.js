var menu = true;
function startScene(number){
	menu= false
	document.querySelector("#container").style.display="none";
	document.body.background = "";
	initScene();
	gridView(20,1);
	switch(number){
		case 1:
			geometry();
		break;
		case 2:

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
		camera.position.set(0,10,0);
		window.addEventListener('resize', onWindowResize, false);
		window.addEventListener('keydown', onKeyDown,false);
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

function geometry(){
	var material, geometry;

  	material = new THREE.MeshPhongMaterial({
    color: 0xffff00});
  	geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5);
  	var cube = new THREE.Mesh(geometry, material);
  	scene.add(cube);
  	cube.position.set(1,0,1);
  	  	var cube = new THREE.Mesh(geometry, material);
  	scene.add(cube);
  	cube.position.set(0,0,1);
  	  	var cube = new THREE.Mesh(geometry, material);
  	scene.add(cube);
  	cube.position.set(0,0,0);

	camera.lookAt(0,-1,0);
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
