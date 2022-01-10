# 3d-model-converter
3d model converter using CLI

### Installing

```bash
$ npm install pm2 -g
```

### Usage

```bash
$ 3d-model-converter -i <import file path> -o <export dir path> -t <target>
$ 3d-model-converter -i model.obj -o ./export -t gltf
$ 3d-model-converter -i model.obj -o ./export -t gltf -b #this will export glb 
```

### Supported formats

##### Import

- FBX
- OBJ
- CTM

##### Export

- GLTF (ascii, binary)
- OBJ
- PLY (ascii, binary)
- STL (ascii, binary)
- USDZ