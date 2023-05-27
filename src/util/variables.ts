import {Collection} from "@discordjs/collection";
import {Router} from "express";
export const globalRoutes = new Collection<string, Router>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cacheStatus:any = {};
