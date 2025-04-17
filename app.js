// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.getElementById('game-container').appendChild(renderer.domElement);

// Camera setup with orbital constraints
const CAMERA_RADIUS = 15;
const MIN_POLAR_ANGLE = 0 * Math.PI / 180;  // 30 degrees (more downward tilt allowed)
const MAX_POLAR_ANGLE = 120 * Math.PI / 180;  // 60 degrees (original downward limit)
let cameraAngle = {
  theta: -45 * Math.PI / 180,  // Start facing the grid head-on
  phi: 45 * Math.PI / 180       // Midpoint between min/max
};

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraTarget = new THREE.Vector3(0, 0, 0);

// Initialize camera position
updateCameraPosition();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Grid and Cubes (unchanged)
const CUBE_SIZE = 1;
const GRID_SIZE = 8;
const cubes = [];
for (let x = 0; x < GRID_SIZE; x++) {
  cubes[x] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
      metalness: 0.1,
      roughness: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      x * CUBE_SIZE * 1.2 - (GRID_SIZE * CUBE_SIZE * 1.2) / 2,
      y * CUBE_SIZE * 1.2 - (GRID_SIZE * CUBE_SIZE * 1.2) / 2,
      0
    );
    scene.add(cube);
    cubes[x][y] = cube;
  }
}

// Camera controls (revised)
let isDragging = false;
let previousMouse = { x: 0, y: 0 };
const LERP_FACTOR = 0.2; // Faster response

function updateCameraPosition() {
  // Debugging: Log current angles
  console.log(`Theta: ${cameraAngle.theta * 180/Math.PI}°, Phi: ${cameraAngle.phi * 180/Math.PI}°`);

  const x = CAMERA_RADIUS * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
  const y = CAMERA_RADIUS * Math.cos(cameraAngle.phi);
  const z = CAMERA_RADIUS * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);

  camera.position.set(x, y, z);
  camera.lookAt(cameraTarget);
}

// Event handlers (fixed delta calculation)
renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMouse = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const delta = {
    x: e.clientX - previousMouse.x,
    y: e.clientY - previousMouse.y
  };

  // Update angles directly (no separate target)
  cameraAngle.theta -= delta.x * 0.005;
  cameraAngle.phi += delta.y * 0.005;
  
  // Apply constraints
  cameraAngle.phi = Math.max(MIN_POLAR_ANGLE, Math.min(MAX_POLAR_ANGLE, cameraAngle.phi));
  
  previousMouse = { x: e.clientX, y: e.clientY };
  updateCameraPosition(); // Immediate update for testing
});

renderer.domElement.addEventListener('mouseup', () => isDragging = false);
renderer.domElement.addEventListener('mouseleave', () => isDragging = false);

// Animation loop (simplified)
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Temporary click test remains unchanged

// Temporary click test
window.addEventListener('click', (event) => {
  const randomCube = cubes[Math.floor(Math.random() * GRID_SIZE)][Math.floor(Math.random() * GRID_SIZE)];
  randomCube.material.color.setHSL(Math.random(), 0.7, 0.5);
});