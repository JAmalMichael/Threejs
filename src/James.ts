import { AnimationAction, AnimationMixer, Group, Mesh, AnimationUtils } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

export default class James extends Group {
  mixer?: AnimationMixer
  glTFLoader: GLTFLoader

  constructor() {
    super()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./node_modules/three/examples/jsm/libs/draco/')

    this.glTFLoader = new GLTFLoader()
    this.glTFLoader.setDRACOLoader(dracoLoader)
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    const [james, idle, run, jump, pose] = await Promise.all([
      this.glTFLoader.loadAsync('models/james$@walk_compressed.glb'),
      this.glTFLoader.loadAsync('models/james@idle.glb'),
      this.glTFLoader.loadAsync('models/james@run.glb'),
      this.glTFLoader.loadAsync('models/james@jump.glb'),
      this.glTFLoader.loadAsync('models/james@pose.glb'),
    ])

    james.scene.traverse((m) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true
      }
    })

    this.mixer = new AnimationMixer(james.scene)
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0])
    //animationActions['walk'] = this.mixer.clipAction(james.animations[0])
    animationActions['walk'] = this.mixer.clipAction(AnimationUtils.subclip(james.animations[0], 'walk', 0, 42))
    //animationActions['run'] = this.mixer.clipAction(run.animations[0])
    animationActions['run'] = this.mixer.clipAction(AnimationUtils.subclip(run.animations[0], 'run', 0, 17))
    // jump.animations[0].tracks = jump.animations[0].tracks.filter(function (e) {
    //   return !e.name.endsWith('.position')
    // })
    // console.log(jump.animations[0].tracks)
    animationActions['jump'] = this.mixer.clipAction(jump.animations[0])
    animationActions['pose'] = this.mixer.clipAction(pose.animations[0])

    animationActions['idle'].play()

    this.add(james.scene)
  }

  update(delta: number) {
    this.mixer?.update(delta)
  }
}