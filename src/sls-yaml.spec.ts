import yaml from "./sls-yaml";

describe("yaml-loader test suite", () => {
  describe("YAML standard spec test suite", () => {
    it("Test #1", () => {
      const content = Buffer.from(`version: 1`);
      const doc = yaml(content);
      expect(doc).toEqual({ version: 1 });
    });
  });
  describe("YAML extended test suite", () => {
    describe("When passing a file reference", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from("config: ${file(src/__mocks__/file.yml)}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: { key: "value" } });
      });
    });
    describe("When passing a file reference without key", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from("${file(src/__mocks__/file.yml)}");
        const doc = yaml(content);
        expect(doc).toEqual({ key: "value" });
      });
    });
    describe("When passing a env reference", () => {
      it("Should replace env var with it's value", () => {
        const content = Buffer.from("config: ${env:NODE_ENV}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "test" });
      });
    });
    describe("When passing a self reference", () => {
      it("Should replace env var with it's value", () => {
        const content = Buffer.from(`
  version: 1
  config: version-\${self:version}
`);
        const doc = yaml(content);
        expect(doc).toEqual({ version: 1, config: "version-1" });
      });
    });
    describe("When passing a file reference with env references", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from(
          "config: ${file(src/__mocks__/file-env.yml)}"
        );
        const doc = yaml(content);
        expect(doc).toEqual({ config: { key: "value-test" } });
      });
    });
    describe("When passing a file reference with self references", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from(
          "config: ${file(src/__mocks__/file-self.yml)}"
        );
        const expected = {
          config: { a: { b: "value-of-b" }, key: "key+value-of-b" }
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });
    });
    describe("When passing a file reference with self references within a file reference", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from(
          "config: ${file(src/__mocks__/file-file-self.yml)}"
        );
        const expected = {
          config: { env: "development", values: { key: "key+development" } }
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });
    });
    describe("When passing a file reference with dynamic self references within a file reference", () => {
      it("Should replace value with file content", () => {
        const content = Buffer.from(
          "config: ${file(src/__mocks__/file-file-self-dynamic.yml)}"
        );
        const expected = {
          config: { env: "development", values: { key: "key+development" } }
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });
    });
  });
});