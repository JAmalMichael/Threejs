import { WebGLRenderer } from "three";

export default class UI {
    renderer: WebGLRenderer
    instructions: HTMLDivElement

    constructor(renderer: WebGLRenderer) {
        this.renderer = renderer

        this.instructions = document.getElementById('instructions') as HTMLDivElement
        if(!this.instructions) {
            console.log("Error, instructions element not found")
        }

        const startButton = document.getElementById('startButton') as HTMLButtonElement
        if(!startButton) {
            console.log("Error, Start-Button element not found")
        }
        startButton.addEventListener(
            'click',
            () => {
                renderer.domElement.requestPointerLock()
            },
            false
        )

        document.addEventListener('pointerlockchange', () => {
            if(document.pointerLockElement === this.renderer.domElement) {
                this.instructions.style.display = 'none'
            } else {
                this.instructions.style.display = 'block'
            }
        })
    }


    show() {
        const spinner = document.getElementById('spinner') as HTMLDivElement;
        if (spinner) {
          spinner.style.display = 'none';
        } else {
          console.error("Error: 'spinner' element not found");
        }
    
        if (this.instructions) {
          this.instructions.style.display = 'block';
        }
    }
}