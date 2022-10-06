import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import CameraControls from './camera-controls.module.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.module.js'
import cameraControlsModule from './camera-controls.module.js';
let scene;
let camera;
let renderer;

let dragStart = null
let currentPos = { x: 0, y: 0 }
let maxDiff = 36
function init() {
    let container = document.querySelector('.about');
    //Scene
    scene = new THREE.Scene()
    scene.background = null;
    //Camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-10, 5, -18)
    // Paralax
    window.addEventListener('mousemove', onMouseMove, false);
    function onMouseMove(event) {
        scene.position.x = (event.clientX - window.innerWidth) / 500;
    }

    let skrollPosition = 0
    const onChangeY = e => {

        if (window.pageYOffset < 300) {
            return
        }
        if (skrollPosition > window.pageYOffset) {
            scene.position.y -= 0.07
        }
        else {
            scene.position.y += 0.07
        }
        skrollPosition = window.pageYOffset

       

        if (window.pageYOffset < 400) {
            scene.position.y = 0
        }

    }

    window.addEventListener('scroll', onChangeY, false)

    //render
    renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    //CameraControls

    CameraControls.install({ THREE: THREE });
    const width = window.innerWidth;
    const height = window.innerHeight;
    const clock = new THREE.Clock();
    const cameraControls = new CameraControls(camera, renderer.domElement);

    //Joystick
    const joystickWrapper = document.createElement('div')
    joystickWrapper.classList.add('about__joystick-wrapper')

    const stick = document.createElement('div')
    stick.classList.add('about__stick')

    joystickWrapper.append(stick)
    document.querySelector('.about__controller').append(joystickWrapper)

    const handleMouseDown = (event) => {
        
        stick.style.transition = '0s';
      
        if (event.changedTouches) {
            event.preventDefault()
            dragStart = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };
            changeCursor = setInterval(rotateCamera, 10)
            return;
        }
       
        dragStart = {
            x: event.clientX,
            y: event.clientY,
        };
        
        changeCursor = setInterval(rotateCamera, 10)
       
    }
    let changeCursor
    let rotateX = 0
    let rotateY = 0

    const rotateCamera = () => {
        cameraControls.rotate(rotateX / 10 * THREE.MathUtils.DEG2RAD, 0, true)
        cameraControls.rotate(0, rotateY / 10 * THREE.MathUtils.DEG2RAD, 0, true)
    }

    const handleMouseMove = (event) => {
        event.stopPropagation()
        stick.style.touchAction = 'none'
        if (dragStart === null) return;

        if (event.changedTouches) {
            
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
        }
        const xDiff = event.clientX - dragStart.x;
        const yDiff = event.clientY - dragStart.y;
        const angle = Math.atan2(yDiff, xDiff);
        const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff));
        const distanceOld = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

        const xNew = distance * Math.cos(angle);
        const yNew = distance * Math.sin(angle);

        rotateX = xNew
        rotateY = yNew

        
        stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;


        currentPos = { x: xNew, y: yNew };



    }
    const handleMouseUp = (event) => {
        container.removeEventListener('wheel',function(e){
            e.stopPropagation()
        })
        clearInterval(changeCursor)
        if (dragStart === null) return;
        stick.style.transition = '.2s';
        stick.style.transform = `translate3d(0px, 0px, 0px)`;
        dragStart = null;
        currentPos = { x: 0, y: 0 };

    }
    stick.addEventListener('touchstart', handleMouseDown)
    stick.addEventListener('touchmove', handleMouseMove)
    stick.addEventListener('touchend', handleMouseUp)

    stick.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)




    let userDragging = false;
    let disableAutoRotate = false;

    const onRest = () => {

        cameraControls.removeEventListener('rest', onRest);
        userDragging = false;
        disableAutoRotate = false;

    }

    cameraControls.addEventListener('controlstart', () => {

        cameraControls.removeEventListener('rest', onRest);
        userDragging = true;
        disableAutoRotate = true;

    });
    cameraControls.addEventListener('controlend', () => {

        if (cameraControls.active) {

            cameraControls.addEventListener('rest', onRest);

        } else {

            onRest();

        }

    });

    //
    cameraControls.addEventListener('transitionstart', () => {

        if (userDragging) return;

        disableAutoRotate = true;
        cameraControls.addEventListener('rest', onRest);

    });

    //light

    const ambient = new THREE.AmbientLight(0x0067ff, 1);
    scene.add(ambient)

    let light2 = new THREE.PointLight(0xc4c4c4, 1);
    light2.position.set(1000, 1000, 8000);
    scene.add(light2)
    let light3 = new THREE.PointLight(0xc4c4c4, 0.9);
    light3.position.set(200, -100, -500);
    scene.add(light3)

    //model
    const loader = new GLTFLoader();

    loader.load('./models/aboutmodel/scene.gltf', gltf => {
        scene.add(gltf.scene);
    },
    )



    //Resize
    window.addEventListener('resize', onWindowResize, false)
  
    function onWindowResize() {
    
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth/ window.innerHeight;
        camera.updateProjectionMatrix();
     
    }

    function animate() {
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();
        const updated = cameraControls.update(delta);
        if (!disableAutoRotate) {
            cameraControls.azimuthAngle += 20 * delta * THREE.MathUtils.DEG2RAD;

        }
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()
}
init()




