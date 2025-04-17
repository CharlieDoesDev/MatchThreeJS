import { Cube } from './Cube.js';

export class GridManager {
    constructor() {
        this.cubes = [];
        this.gridSize = 8;
        this.spacing = 1.2;
        this.initGrid();
    }

    initGrid() {
        for (let x = 0; x < this.gridSize; x++) {
            this.cubes[x] = [];
            for (let y = 0; y < this.gridSize; y++) {
                const cube = new Cube(x, y, this.gridSize, this.spacing);
                cube.addEventListener('click', () => this.handleCubeClick(x, y));
                this.cubes[x][y] = cube;
            }
        }
    }

    handleCubeClick(x, y) {
        console.log(`Cube clicked at [${x}, ${y}]`);
        // Add your match-3 logic here
    }

    // Update handleHover to include click detection
    handleInteraction(intersects, isClick = false) {
        this.cubes.flat().forEach(cube => {
            const wasHovered = cube.hovered;
            cube.hovered = intersects.some(i => i.object === cube.mesh);
            
            if(isClick && cube.hovered && !wasHovered) {
                cube.handleClick();
            }
        });
    }

    getObjects() {
        return this.cubes.flat().map(cube => cube.mesh);
    }

    update(delta) {
        this.cubes.flat().forEach(cube => cube.update(delta));
    }

    handleHover(intersects) {
        this.cubes.flat().forEach(cube => {
            cube.hovered = intersects.some(i => i.object === cube.mesh);
        });
    }
}