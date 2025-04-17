// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee); // Light gray background
document.getElementById('game-container').appendChild(renderer.domElement);

// Position camera (looking slightly down at the grid)
camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

// Lighting (critical for 3D materials)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// ---------------------------------
// Grid and Cubes (Basic Example)
// ---------------------------------
const CUBE_SIZE = 1;
const GRID_SIZE = 8;
const cubes = [];

// Create a simple grid of colored cubes
for (let x = 0; x < GRID_SIZE; x++) {
  cubes[x] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    // Create cube
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5), // Random hue
      metalness: 0.1,
      roughness: 0.5
    });
    const cube = new THREE.Mesh(geometry, material);
    
    // Position cubes with spacing
    cube.position.set(
      x * CUBE_SIZE * 1.2 - (GRID_SIZE * CUBE_SIZE * 1.2) / 2,
      y * CUBE_SIZE * 1.2 - (GRID_SIZE * CUBE_SIZE * 1.2) / 2,
      0
    );
    
    scene.add(cube);
    cubes[x][y] = cube;
  }
}

// ---------------------------------
// Animation Loop
// ---------------------------------
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------
// Temporary Click Test (Debugging)
// ---------------------------------
window.addEventListener('click', (event) => {
  // We'll replace this with proper raycasting later
  const randomCube = cubes[Math.floor(Math.random() * GRID_SIZE)][Math.floor(Math.random() * GRID_SIZE)];
  randomCube.material.color.setHSL(Math.random(), 0.7, 0.5);
});