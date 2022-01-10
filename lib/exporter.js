import fs from "fs";
import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter.js";
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter.js";
import {PLYExporter} from "three/examples/jsm/exporters/PLYExporter.js";
import {STLExporter} from "three/examples/jsm/exporters/STLExporter.js";
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter.js";
import chalk from 'chalk';

export function exportGLTF(obj, output, isBinary){

    if (!obj){
        console.error('Invalid file content'); return;
    }

    try{
        const fileExtension = isBinary ? 'glb' : 'gltf';
        const exporter = new GLTFExporter();
        exporter.parse(obj, (content) => {

            console.log(`Writing file ${output}`);
            if(isBinary){

                var data = new Uint8Array(content);
                content = Buffer.from(data);

            } else if (typeof content === 'object') content = JSON.stringify(content);


            fs.writeFileSync(`${output}.${fileExtension}`, content);
        }, (e) => {
            console.log('ExportError:',e.message)
        }, {binary: isBinary});
    }  catch (e) {
        console.log(chalk.red(`GLTFExporter Error: ${e.message}`))
    }
}

export function exportOBJ(obj, output){

    if (!obj){
        console.error('Invalid file content'); return;
    }

    const exporter = new OBJExporter();
    const content = exporter.parse( obj );

    console.log(`Writing to ${output}`);
    fs.writeFileSync(`${output}.obj`, content);
}

export function exportPLY(obj, output, isBinary){

    if (!obj){
        console.error('Invalid file content'); return;
    }

    try {
        const exporter = new PLYExporter();
        exporter.parse(obj, (content) => {

            if (isBinary){
                const data = new Uint8Array(content);
                content = Buffer.from(data);
            }

            console.log(`Writing file ${output}`);
            fs.writeFileSync(`${output}.ply`, content);

        }, {binary: !!isBinary});
    } catch (e) {
        console.log(chalk.red(`PLYExporter Error: ${e.message}`))
    }
}


export function exportSTL(obj, output, isBinary) {

    if (!obj) {
        console.error('Invalid file content');
        return;
    }

    try{
        const exporter = new STLExporter();
        const content  = exporter.parse(obj, {binary: !!isBinary});

        console.log(`Writing file ${output}`);
        fs.writeFileSync(`${output}.stl`, content);
    }  catch (e) {
        console.log(chalk.red(`STLExporter Error: ${e.message}`))
    }

}

export function exportUSDZ(obj, output) {

    if (!obj) {
        console.error('Invalid file content');
        return;
    }

    try{
        const exporter = new USDZExporter();
        let content  = exporter.parse(obj, {binary: true});

        content.then((data) => {
            content = Buffer.from(data);
            console.log(`Writing file ${output}`);
            fs.writeFileSync(`${output}.usdz`, content);
        }).catch(e => {
            console.log(chalk.red(`USDZExporter Error: ${e.message}`))
        })

    }  catch (e) {
        console.log(chalk.red(`USDZExporter Error: ${e.message}`))
    }
}