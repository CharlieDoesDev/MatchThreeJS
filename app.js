// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.getElementById('game-container').appendChild(renderer.domElement);

// Camera setup with orbital constraints
const CAMERA_RADIUS = 15;
const MIN_POLAR_ANGLE = 45 * Math.PI / 180;  // 45 degrees (top limit)
const MAX_POLAR_ANGLE = 60 * Math.PI / 180;  // 60 degrees (bottom limit)
let cameraAngle = {
  theta: 35 * Math.PI / 180,  // Horizontal angle
  phi: 50 * Math.PI / 180     // Vertical angle
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

// Grid and Cubes
const CUBE_SIZE = 1;
const GRID_SIZE = 8;
const cubes = [];

// Create grid
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

// Camera controls
let isDragging = false;
let previousMouse = { x: 0, y: 0 };
const LERP_FACTOR = 0.1;
let targetCameraAngle = { ...cameraAngle };

function updateCameraPosition() {
  const x = CAMERA_RADIUS * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
  const y = CAMERA_RADIUS * Math.cos(cameraAngle.phi);
  const z = CAMERA_RADIUS * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);

  camera.position.set(x, y, z);
  camera.lookAt(cameraTarget);
}

// Event handlers
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

  targetCameraAngle.theta -= delta.x * 0.005;
  targetCameraAngle.phi += delta.y * 0.005;
  
  // Apply constraints
  targetCameraAngle.phi = Math.max(MIN_POLAR_ANGLE, Math.min(MAX_POLAR_ANGLE, targetCameraAngle.phi));
  
  previousMouse = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => isDragging = false);
renderer.domElement.addEventListener('mouseleave', () => isDragging = false);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Smooth camera movement
  cameraAngle.theta += (targetCameraAngle.theta - cameraAngle.theta) * LERP_FACTOR;
  cameraAngle.phi += (targetCameraAngle.phi - cameraAngle.phi) * LERP_FACTOR;
  
  updateCameraPosition();
  renderer.render(scene, camera);
}
animate();

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Temporary click test
window.addEventListener('click', (event) => {
  const randomCube = cubes[Math.floor(Math.random() * GRID_SIZE)][Math.floor(Math.random() * GRID_SIZE)];
  randomCube.material.color.setHSL(Math.random(), 0.7, 0.5);
});