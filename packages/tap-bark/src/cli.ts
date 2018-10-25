#!/usr/bin/env node

import { TapBark } from "./tap-bark";

const bark = TapBark.create();

process.stdin.pipe(bark.getPipeable()).pipe(process.stdout);
