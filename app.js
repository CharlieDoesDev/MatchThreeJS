import { GridManager } from './grid/GridManager.js';

// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Initialize systems
const gridManager = new GridManager();
gridManager.getObjects().forEach(obj => scene.add(obj));

// Camera setup
camera.position.set(0, 0, -20);
camera.lookAt(0, 0, 0);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Renderer setup
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.getElementById('game-container').appendChild(renderer.domElement);

// Event listeners
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update hover states
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(gridManager.getObjects());
    gridManager.handleHover(intersects);
    
    // Update cubes
    gridManager.update();
    
    renderer.render(scene, camera);
}
animate();