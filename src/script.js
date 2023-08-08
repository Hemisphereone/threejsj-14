import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

THREE.ColorManagement.enabled = false


/**
 * Fonts
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/textures/matcaps/4.png')
const matCapTexture2 = textureLoader.load('/textures/matcaps/5.png')
const matCapTexture3 = textureLoader.load('/textures/matcaps/8.png')

const fontLoader = new FontLoader()

fontLoader.load(
    'Fonts/helvetiker_regular.typeface.json',
    ( font ) => {
		// do something with the font
        const bevelSize = 0.02
        const textGeometry = new TextGeometry(
             `Donut Me!`,
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments:  6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: bevelSize,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        // textGeometry.computeBoundingBox()
        // //Center the text
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - bevelSize) * 0.5,
        //     - (textGeometry.boundingBox.max.y - bevelSize) * 0.5,
        //     - (textGeometry.boundingBox.max.z - bevelSize) * 0.5,
        // )
        textGeometry.center()
        console.log(textGeometry.height)
        const textMaterial =  new THREE.MeshMatcapMaterial( { matcap: matCapTexture})
        const textMesh = new THREE.Mesh(textGeometry,textMaterial)
        scene.add(textMesh)
	},
    ( xhr ) => {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	}
    

)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture2})
const donutMaterial2 = new THREE.MeshMatcapMaterial({ matcap: matCapTexture3})
const donutArray = []

for ( let i = 0; i < 200; i++ ){
    console.log(i % 2 == 0)
    let donut
    if (i % 2 == 0) {
        console.log('even')
        donut = new THREE.Mesh(donutGeometry,donutMaterial) 
    } else {
        console.log('odd')
        donut = new THREE.Mesh(donutGeometry,donutMaterial2) 
    }
    console.log(donut)
    
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const randomScale = Math.random()
    donut.scale.set(randomScale,randomScale,randomScale)
    
    scene.add(donut)
    donutArray.push(donut)
}



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    
    //Move objects
    for ( let i = 0; i < donutArray.length; i++ ){
       donutArray[i].rotation.x += 0.01 
       donutArray[i].rotation.y += 0.01
       //console.log()
    }

    // Update controls
    controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()