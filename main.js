import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';




const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x5a5958);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(16.62840240547767,14.680981318286893,-15.00006819953652);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(-0.04451, 1.99225, -0.269198);




const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

RectAreaLightUniformsLib.init();

// const rectLight1 = new THREE.RectAreaLight( 0xeed6a0, 5, 4, 10 );
// 				rectLight1.position.set( - 5, 5, 5);
// 				scene.add( rectLight1 );

				const rectLight2 = new THREE.RectAreaLight( 0xeed6a0, 4, 10, 8 );
				rectLight2.position.set( 0, 10, 0 );
        rectLight2.lookAt( 0, 5, 0 );
				scene.add( rectLight2 );

				// const rectLight3 = new THREE.RectAreaLight( 0xeed6a0, 5, 4, 10 );
				// rectLight3.position.set( 5, 5, -7 );
        // rectLight3.lookAt( 0, 5, 0 );
				// scene.add( rectLight3 );

				// scene.add( new RectAreaLightHelper( rectLight1 ) );
				// scene.add( new RectAreaLightHelper( rectLight2 ) );
				// scene.add( new RectAreaLightHelper( rectLight3 ) );


const spotLight = new THREE.SpotLight(0xeed6a0, 3000, 100, 0.30, 0.5);
spotLight.position.set(0, 23, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.00001;
scene.add(spotLight);



const loader = new GLTFLoader().setPath('public/bedroom/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);


  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});



window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const raycaster = new THREE.Raycaster();

document.addEventListener('mousedown', onMouseDown);

function onMouseDown(even){
  const coords = new THREE.Vector2(
    (even.clientX / renderer.domElement.clientWidth) * 2 - 1, 
    - ((even.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);

  const intersection = raycaster.intersectObjects(scene.children, true);
  if(intersection.length > 0){
    console.log(intersection);
  }

}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  controls.update();
}

animate();


const render = () => {
  console.log(camera.position);
  console.log("00000000");
  console.log(controls.target);

}

render();

