export class Cube {
    constructor(x, y, gridSize, spacing) {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
            metalness: 0.1,
            roughness: 0.5
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.originalPosition = new THREE.Vector3();
        this.targetZ = 0;
        this.hovered = false;

        this.setPosition(x, y, gridSize, spacing);
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
        const targetZ = this.hovered ? -1 : 0;
        this.targetZ += (targetZ - this.targetZ) * 0.1;
        
        this.mesh.position.z = THREE.MathUtils.lerp(
            this.mesh.position.z,
            this.originalPosition.z + this.targetZ,
            0.1
        );
    }

    setColor(color) {
        this.material.color.set(color);
    }
}