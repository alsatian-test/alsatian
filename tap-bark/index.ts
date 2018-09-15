#!/usr/bin/env node

import { TapBark } from "./src/tap-bark";

let bark = TapBark.create();

process.stdin
    .pipe(bark.getPipeable())
    .pipe(process.stdout);
