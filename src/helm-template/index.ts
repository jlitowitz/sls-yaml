import { compile } from "../sls-yaml-compiler";
const fs = require("fs");
const yaml = require("js-yaml");

type ParentNode = {
  name: string;
  self: any;
};

type Path = string;

function encodeHelmTemplates(data: string) {
  const lines = data.split("\n");
  return lines
    .map(line => {
      if (line) {
        const [key, ...value] = line.split(":");
        const values = value.join(":").trim();
        if (values && values.match(/({(\s*){)(\W|\w)*(}(\s*)})/gi)) {
          const result = `${key}: '${values
            .replace(/{\s*{/gi, "%[")
            .replace(/}\s*}/gi, "]%")}'`;
          return result;
        }
      }
      return line;
    })
    .join("\n");
}

function decodeHelmTemplates(data: string) {
  const lines = data.split("\n");
  return lines
    .map(line => {
      if (line) {
        const [key, ...value] = line.split(":");
        let values = value.join(":").trim();
        if (values && values.match(/(%\[)(\W|\w)*(]%)/gi)) {
          values = values.substring(1, values.length - 1).trim();
        }
        const result = `${key}: ${values
          .replace(/%\[/gi, "{{")
          .replace(/]%/gi, "}}")}`;
        return result;
      }
      return line;
    })
    .join("\n");
}

export function readHelmTemplateSync(
  pathOrData: Path | Buffer,
  parent?: ParentNode
) {
  let data,
    basePath = "./";

  if (typeof pathOrData === "string") {
    basePath = pathOrData.substring(0, pathOrData.lastIndexOf("/"));
    data = fs.readFileSync(pathOrData, "utf8");
  }
  if (pathOrData instanceof Buffer) {
    data = pathOrData.toString();
  }
  data = encodeHelmTemplates(data);

  const doc = yaml.safeLoad(data);

  let globalObj = doc;
  if (parent) {
    globalObj = {
      ...parent.self,
      [parent.name]: doc
    };
  }

  const compiledDoc = compile({ doc, globalObj, basePath });
  const yamlData = yaml.safeDump(compiledDoc);
  const decodedYaml = decodeHelmTemplates(yamlData);
  return decodedYaml;
}