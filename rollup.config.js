/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */

import nodeResolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import InlineSvg from 'rollup-plugin-inline-svg';
import copy from 'rollup-plugin-copy';

export function copyPlugin() {
  return copy({
    targets: [
      { src: 'src/_locales/*', dest: 'dist/_locales/' },
    ],
  });
}

export function replacePlugin() {
  return replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    preventAssignment: true,
  });
}

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name][extname]',
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: true,
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Transform decorators with babel */
    babel({ babelHelpers: 'bundled' }),
    /** Minify JS, compile JS to a lower language target */
    esbuild({
      minify: true,
      target: ['chrome64', 'firefox67', 'safari11.1'],
    }),
    replacePlugin(),
    InlineSvg(),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Copy static assets */
    copyPlugin(),
  ],
};
