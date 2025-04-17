export class Cube extends EventTarget {
    constructor(x, y, gridSize, spacing) {
        super();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.originalColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
        this.targetColor = this.originalColor.clone();
        this.material = new THREE.MeshStandardMaterial({
            color: this.originalColor,
            metalness: 0.1,
            roughness: 0.5
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.originalPosition = new THREE.Vector3();
        this.targetZ = 0;
        this.hovered = false;
        this.active = true;
        this.clickCooldown = false;

        this.setPosition(x, y, gridSize, spacing);
        
        // Add click handler to the mesh
        this.mesh.userData.cubeInstance = this;
    }

    setPosition(gridX, gridY, gridSize, spacing) {
        const offset = (gridSize * spacing) / 2;
        this.originalPosition.set(
            gridX * spacing - offset,
            gridY * spacing - offset,
            0
        );
        this.mesh.position.copy(this.originalPosition);
    }

    update(delta) {
        // Update Z position
        const targetZ = this.hovered ? -1 : 0;
        this.targetZ = THREE.MathUtils.lerp(this.targetZ, targetZ, 0.1);
        this.mesh.position.z = this.originalPosition.z + this.targetZ;

        // Update color
        if(!this.material.color.equals(this.targetColor)) {
            this.material.color.lerp(this.targetColor, 0.1);
        }
    }

    pulse() {
        if(this.clickCooldown) return;
        
        // Store original color
        const original = this.material.color.clone();
        
        // Set immediate color to white
        this.material.color.set(0xffffff);
        this.targetColor.copy(original);
        
        // Set cooldown
        this.clickCooldown = true;
        setTimeout(() => {
            this.clickCooldown = false;
        }, 1000);
    }

    handleClick() {
        if(!this.active) return;
        this.dispatchEvent(new Event('click'));
        this.pulse();
    }

    setActive(state) {
        this.active = state;
    }
}