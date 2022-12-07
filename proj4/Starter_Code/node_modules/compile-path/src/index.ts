import { compile, PathFunction } from "path-to-regexp";
import { stringify as stringifyQuery } from "qs";

interface CompilePathParams {
  [key: string]: string | number | string[] | number[];
}
interface CompilePathQuery {
  [key: string]: any;
}
interface CompilePathCache {
  [key: string]: PathFunction;
}

const compilePathCache: CompilePathCache = {};

export function compilePath(
  pattern: string,
  params?: CompilePathParams,
  query?: CompilePathQuery
): string {
  if (!compilePathCache[pattern]) {
    compilePathCache[pattern] = compile(pattern);
  }

  const compiledPath = compilePathCache[pattern](params);
  const stringifiedQuery = query ? stringifyQuery(query) : null;

  return stringifiedQuery
    ? `${compiledPath}?${stringifiedQuery}`.trim()
    : compiledPath.trim();
}
