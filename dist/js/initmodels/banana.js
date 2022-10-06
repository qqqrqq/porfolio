import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";



 const button_one = document.querySelector('.banana__one')
 const button_two = document.querySelector('.banana__two')
 const button_three = document.querySelector('.banana__three')


let scene;
let camera;
let renderer;
let mixer;


function init() {
    let container = document.querySelector('.banana');


    //Scene
    scene = new THREE.Scene()
    scene.background = null;

    //Camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(51, 131, 329)



    // Effects

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

    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.minDistance = 1;
    window.innerWidth<1120 ?   controls.target.set(-20, 90, 2) :   controls.target.set(-120, 90, 2)
    controls.enableZoom = false;
    // controls.autoRotate = true



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

    loader.load('./models/banana/scene.gltf', gltf => {
        const model = gltf.scene
        mixer = new THREE.AnimationMixer(model)


        const switchAnim = (num) => {
            animation.stop()
           let action_num = num
           animation = mixer.clipAction(gltf.animations[action_num])
           if(action_num == 0){
            animation.setLoop( THREE.LoopOnce )
           }
            animation.play()
        }


        button_one.addEventListener('click', () => { switchAnim(0) })
         button_two.addEventListener('click', () => { switchAnim(1) })
        button_three.addEventListener('click', () => { switchAnim(2) })

        let animation = mixer.clipAction(gltf.animations[0])
        animation.setLoop( THREE.LoopOnce )
        animation.play()


        scene.add(model)
    },
        
    )



    //Resize
    window.addEventListener('resize', onWindowResize, false)
   
    function onWindowResize() {
        window.innerWidth<1120 ?   controls.target.set(-20, 90, 2) :   controls.target.set(-120, 90, 2)

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth/ window.innerHeight;
        camera.updateProjectionMatrix();
     
    }
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate)
        if (mixer) {
            mixer.update(clock.getDelta())
        }
        controls.update();
        renderer.render(scene, camera)

    }
    animate()
}
init()