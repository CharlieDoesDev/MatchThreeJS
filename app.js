/*****************************
 * CONFIGURATION VARIABLES
 *****************************/
const CAMERA_CONFIG = {
    RADIUS: 15,                          // Distance from grid center
    MIN_POLAR_ANGLE: 20 * Math.PI / 180, // 30 degrees (minimum vertical tilt)
    MAX_POLAR_ANGLE: 180 * Math.PI / 180, // 60 degrees (maximum vertical tilt)
    MIN_AZIMUTH_ANGLE: 0 * Math.PI / 180, // -45 degrees (left rotation limit)
    MAX_AZIMUTH_ANGLE: 180 * Math.PI / 180,  // 45 degrees (right rotation limit)
    INITIAL_THETA: 0,                     // Starting horizontal angle
    INITIAL_PHI: 45 * Math.PI / 180,      // Starting vertical angle
    LERP_FACTOR: 0.1,                     // Camera movement smoothness
    MOUSE_SENSITIVITY: 0.005
  };
  
  const GRID_CONFIG = {
    SIZE: 8,                             // 8x8 grid
    CUBE_SIZE: 1,
    SPACING: 1.2                         // Space between cubes
  };
  
  /*****************************
   * SCENE SETUP
   *****************************/
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  
  // Initialize renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee);
  document.getElementById('game-container').appendChild(renderer.domElement);
  
  /*****************************
   * CAMERA SYSTEM
   *****************************/
  let cameraAngle = {
    theta: CAMERA_CONFIG.INITIAL_THETA,
    phi: CAMERA_CONFIG.INITIAL_PHI
  };
  
  let targetCameraAngle = { ...cameraAngle };
  
  function updateCameraPosition() {
    // Apply rotation constraints
    targetCameraAngle.theta = Math.max(CAMERA_CONFIG.MIN_AZIMUTH_ANGLE, 
      Math.min(CAMERA_CONFIG.MAX_AZIMUTH_ANGLE, targetCameraAngle.theta));
    targetCameraAngle.phi = Math.max(CAMERA_CONFIG.MIN_POLAR_ANGLE, 
      Math.min(CAMERA_CONFIG.MAX_POLAR_ANGLE, targetCameraAngle.phi));
  
    // Smoothly interpolate angles
    cameraAngle.theta += (targetCameraAngle.theta - cameraAngle.theta) * CAMERA_CONFIG.LERP_FACTOR;
    cameraAngle.phi += (targetCameraAngle.phi - cameraAngle.phi) * CAMERA_CONFIG.LERP_FACTOR;
  
    // Convert spherical to cartesian coordinates
    const x = CAMERA_CONFIG.RADIUS * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
    const y = CAMERA_CONFIG.RADIUS * Math.cos(cameraAngle.phi);
    const z = CAMERA_CONFIG.RADIUS * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
  
    camera.position.set(x, y, z);
    camera.lookAt(cameraTarget);
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
   * INPUT HANDLING
   *****************************/
  let isDragging = false;
  let previousMouse = { x: 0, y: 0 };
  
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
  
    targetCameraAngle.theta -= delta.x * CAMERA_CONFIG.MOUSE_SENSITIVITY;
    targetCameraAngle.phi += delta.y * CAMERA_CONFIG.MOUSE_SENSITIVITY;
  
    previousMouse = { x: e.clientX, y: e.clientY };
  });
  
  renderer.domElement.addEventListener('mouseup', () => isDragging = false);
  renderer.domElement.addEventListener('mouseleave', () => isDragging = false);
  
  /*****************************
   * ANIMATION LOOP
   *****************************/
  function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
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