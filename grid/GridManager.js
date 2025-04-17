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
                this.cubes[x][y] = new Cube(x, y, this.gridSize, this.spacing);
            }
        }
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