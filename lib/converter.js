import fs from 'fs';
import path from 'path';
import { Blob, FileReader } from 'vblob';
import {
    exportGLTF,
    exportOBJ,
    exportPLY,
    exportSTL,
    exportUSDZ
} from "./exporter.js";
import CTM from "./ctm/ctm.js";
import {CTMLoader} from "./ctm/CTMLoader.js";
import {
    BufferAttribute,
    MeshStandardMaterial,
    Mesh
} from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import chalk from "chalk";

global.window = global;
global.Blob = Blob;
global.FileReader = FileReader;
global.requestAnimationFrame = ( f ) => {
    if (typeof f === "function"){
        f();
    }
}

function exportTo(object, exportType, isBinary, output){

    switch ( exportType ) {
        case 'gltf':
            exportGLTF(object, output, isBinary);
            break;
        case 'obj':
            exportOBJ(object, output);
            break;
        case 'ply':
            exportPLY(object, output, isBinary);
            break;
        case 'stl':
            exportSTL(object, output, isBinary);
            break;
        case 'usdz':
            exportUSDZ(object, output, isBinary);
            break;
    }
}

function Converter(filePath, exportType, isBinary, output){
    const extension = path.extname(filePath).toLowerCase().replace('.','');
    const file = fs.readFileSync(filePath);

    const fileName = path.basename(filePath).replace(path.extname(filePath), '')
    if (!output){
        const dirName = path.dirname(filePath);
        output = `${dirName}/${fileName}`;
    } else if ( fs.lstatSync(output).isDirectory() ){
        output = `${output}/${fileName}`;
    }

    switch ( extension ) {
        case 'ctm':{
            const arraybuffer = Uint8Array.from(file).buffer;
            const data = new Uint8Array(arraybuffer);
            const stream = new CTM.Stream(data);
            stream.offset = 0;
            const loader = new CTMLoader();
            loader._createGeometry( new CTM.File( stream ), function( geometry ) {
                geometry.sourceType = "ctm";
                geometry.sourceFile = fileName;

                const material = new MeshStandardMaterial();
                if(typeof geometry.attributes !== 'undefined' && typeof geometry.attributes.uv !== 'undefined' && typeof geometry.attributes.uv.array !== 'undefined'){
                    const uvs = geometry.attributes.uv.array;
                    geometry.setAttribute( 'uv2', new BufferAttribute( uvs, 2 ) );
                }

                const mesh = new Mesh(geometry, material);
                mesh.name = fileName;

                exportTo(mesh, exportType, isBinary, output);
            });
        } break;
        case 'fbx': {
            const arraybuffer = Uint8Array.from(file).buffer;
            const loader = new FBXLoader();
            const object = loader.parse(arraybuffer, filePath);
            exportTo(object, exportType, isBinary, output);
        } break;
        case 'obj': {
            const fileContent = file.toString();
            const loader = new OBJLoader();
            const object = loader.parse(fileContent);
            exportTo(object, exportType, isBinary, output);
        } break;
        default:
            console.log(chalk.red(`Unknown model. Import supported CTM, FBX, OBJ`))
            break;
    }
}

export default Converter;