import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

let scene;
let camera;
let renderer;
let mixer;
function init() {
    let container = document.querySelector('.mainpage');
    //Scene
    scene = new THREE.Scene()
    scene.background = null;

    //Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth /  window.innerHeight, 4, 100000 );

    window.innerWidth<1215 ? camera.position.set(-98,68,-154) :  camera.position.set(36,85,-240);


    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
        scene.position.x = (event.clientX - window.innerWidth)/ 50;
    }


    //render
    renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight)
  
    container.appendChild(renderer.domElement)

    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    
    controls.enableDamping = false;
    controls.enabled = false
    controls.minDistance = 1;
    controls.enableZoom = false;
 
    controls.target.set(100,30,0)
    //controls.autoRotate = true
   

    //light

    const ambient = new THREE.AmbientLight(0x0067ff, 1);
    scene.add(ambient)


    let light1 = new THREE.PointLight(0xc4c4c4, 2);
    light1.position.set(0,0,0);
    scene.add(light1)
    let light2 = new THREE.PointLight(0xc4c4c4, 2);
    light2.position.set(100,100,-180);
    scene.add(light2)
    let light3 = new THREE.PointLight(0xc4c4c4, 0.9);
    light3.position.set(200, -100, -500);
    scene.add(light3)

    //model
    const loader = new GLTFLoader();



    loader.load('./models/firstmodel/scene.gltf', function (gltf){
        const model = gltf.scene
        mixer = new THREE.AnimationMixer(model)
        let clip = gltf.animations[0]
        mixer.clipAction(clip).play()
        scene.add(model)
     })


    //Resize
    window.addEventListener('resize', onWindowResize, false)
    
    function onWindowResize() {
        window.innerWidth<1215 ? camera.position.set(-98,68,-154) :  camera.position.set(36,85,-240)

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth/ window.innerHeight;
        camera.updateProjectionMatrix();
     
    }

    
    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate)
        if(mixer){
            mixer.update(clock.getDelta())
        }
        controls.update();
        renderer.render(scene, camera)
    }
    animate()

}
init()