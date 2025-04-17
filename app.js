/*****************************
 * CONFIGURATION VARIABLES
 *****************************/
const CAMERA_CONFIG = {
    RADIUS: 25,                          // Distance from grid center
    FIXED_THETA: 0,                      // Front-facing angle
    FIXED_PHI: 0 * Math.PI / 180,       // 60 degree downward angle
    ASPECT_RATIO: window.innerWidth / window.innerHeight
  };
  
  const GRID_CONFIG = {
    SIZE: 8,
    CUBE_SIZE: 1,
    SPACING: 1.2
  };
  
  /*****************************
   * SCENE SETUP
   *****************************/
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const camera = new THREE.PerspectiveCamera(
    45,
    CAMERA_CONFIG.ASPECT_RATIO,
    0.1,
    1000
  );
  
  // Initialize renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee);
  document.getElementById('game-container').appendChild(renderer.domElement);
  
  /*****************************
   * CAMERA POSITIONING
   *****************************/
  function setFixedCamera() {
    // Convert spherical to cartesian coordinates
    const x = CAMERA_CONFIG.RADIUS * Math.sin(CAMERA_CONFIG.FIXED_PHI) * Math.cos(CAMERA_CONFIG.FIXED_THETA);
    const y = CAMERA_CONFIG.RADIUS * Math.cos(CAMERA_CONFIG.FIXED_PHI);
    const z = CAMERA_CONFIG.RADIUS * Math.sin(CAMERA_CONFIG.FIXED_PHI) * Math.sin(CAMERA_CONFIG.FIXED_THETA);
  
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0); // Look at grid center
  }
  
  /*****************************
   * LIGHTING
   *****************************/
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  /*****************************
   * GRID SYSTEM
   *****************************/
  const cubes = [];
  const gridCenterOffset = (GRID_CONFIG.SIZE * GRID_CONFIG.CUBE_SIZE * GRID_CONFIG.SPACING) / 2;
  
  for (let x = 0; x < GRID_CONFIG.SIZE; x++) {
    cubes[x] = [];
    for (let y = 0; y < GRID_CONFIG.SIZE; y++) {
      const geometry = new THREE.BoxGeometry(GRID_CONFIG.CUBE_SIZE, GRID_CONFIG.CUBE_SIZE, GRID_CONFIG.CUBE_SIZE);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
        metalness: 0.1,
        roughness: 0.5
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        x * GRID_CONFIG.CUBE_SIZE * GRID_CONFIG.SPACING - gridCenterOffset,
        y * GRID_CONFIG.CUBE_SIZE * GRID_CONFIG.SPACING - gridCenterOffset,
        0
      );
      
      scene.add(cube);
      cubes[x][y] = cube;
    }
  }
  
  /*****************************
   * INITIAL SETUP
   *****************************/
  setFixedCamera(); // Set static camera position
  
  /*****************************
   * ANIMATION LOOP
   *****************************/
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  
  /*****************************
   * WINDOW RESIZE HANDLER
   *****************************/
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  /*****************************
   * DEBUGGING (TEMPORARY)
   *****************************/
  window.addEventListener('click', (e) => {
    // Random cube color change test
    const randomX = Math.floor(Math.random() * GRID_CONFIG.SIZE);
    const randomY = Math.floor(Math.random() * GRID_CONFIG.SIZE);
    cubes[randomX][randomY].material.color.setHSL(Math.random(), 0.7, 0.5);
  });