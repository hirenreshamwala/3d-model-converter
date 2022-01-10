#!/usr/bin/env node

import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import fs from 'fs';
import chalk from 'chalk';
import Converter from '../lib/converter.js';

const options = yargs
    .usage("Usage: -i <input path> -t <target extension>")
    .option("i", { alias: "input", describe: "Input file path", type: "string", demandOption: true })
    .option("t", { alias: "target", describe: "Target extension (GLTF, OBJ, PLY, STL, USDZ)", type: "string", demandOption: true })
    .option("o", { alias: "output", describe: "Output file path", type: "string", demandOption: false })
    .option("b", { alias: "binary", describe: "Export type binary (supported GLTF, PLY, STL only)", type: "boolean", demandOption: false })
    .check(function (argv) {
        if (argv.target && !['GLTF','OBJ','PLY','STL','USDZ'].includes( argv.target.toUpperCase() )){
            throw(new Error('Error: supported targets GLTF, OBJ, PLY, STL, USDZ'));
        }
        return true;
    })
    .argv;

if (!fs.existsSync(options.input)) {
    console.log(chalk.red('Error: input file does not exist'));
    process.exit(0);
}

Converter(options.input, options.target, options.binary, options.output);
