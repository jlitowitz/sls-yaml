import yaml from "./sls-yaml";

describe("yaml-loader test suite", () => {
  describe("YAML standard spec test suite", () => {
    xit("Test #1", () => {
      const content = Buffer.from(`version: 1`);
      const doc = yaml(content);
      expect(doc).toEqual({ version: 1 });
    });
  });

  describe("YAML extended test suite", () => {
    describe("When passing yaml file path", () => {
      xit("Should load yaml from path", () => {
        const doc = yaml("src/__mocks__/file.yml");
        expect(doc).toEqual({ key: "value" });
      });
    });
    describe("When passing yaml file buffer", () => {
      xit("Should load yaml from path", () => {
        const doc = yaml("src/__mocks__/file.yml");
        expect(doc).toEqual({ key: "value" });
      });
    });

    describe("When passing a yaml file reference", () => {
      xit("Should replace value with file content", () => {
        const content = Buffer.from("config: ${file(src/__mocks__/file.yml)}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: { key: "value" } });
      });
    });

    describe("When passing a yaml file reference without key", () => {
      xit("Should replace value with file content", () => {
        const content = Buffer.from("${file(src/__mocks__/file.yml)}");
        const doc = yaml(content);
        expect(doc).toEqual({ key: "value" });
      });
    });

    describe("When passing a json file reference", () => {
      xit("Should replace value with file's content", () => {
        const content = Buffer.from("json: ${file(src/__mocks__/file.json)}");
        const doc = yaml(content);
        expect(doc).toEqual({ json: { name: "Json", value: 100 } });
      });
    });

    describe("When passing a text file reference", () => {
      xit("Should replace value with file's content", () => {
        const content = Buffer.from("text: ${file(src/__mocks__/file.txt)}");
        const doc = yaml(content);
        expect(doc).toEqual({ text: "This is external text content\n" });
      });
    });

    describe("When passing a env reference", () => {
      xit("Should replace env var with it's value", () => {
        const content = Buffer.from("config: ${env:NODE_ENV}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "test" });
      });
    });

    describe("When passing a env reference", () => {
      xit("Should replace env var with it's value", () => {
        const content = Buffer.from("config: ${env:NODE_ENV}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "test" });
      });
    });

    describe("When passing a undefined env reference", () => {
      xit("Should replace env var with undefined object", () => {
        const content = Buffer.from("config: ${env:IAM_NOT_EXIST}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: undefined });
      });
    });
    describe("When passing a env reference with prefix", () => {
      xit("Should return prefix plus replace env var with it's value", () => {
        const content = Buffer.from("config: prefix-${env:NODE_ENV}");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "prefix-test" });
      });
    });
    describe("When passing a env reference with suffix", () => {
      xit("Should return suffix plus replace env var with it's value", () => {
        const content = Buffer.from("config: ${env:NODE_ENV}-suffix");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "test-suffix" });
      });
    });
    describe("When passing a env reference with prefix and suffix", () => {
      xit("Should return prefix and suffix plus replace env var with it's value", () => {
        const content = Buffer.from("config: prefix-${env:NODE_ENV}-suffix");
        const doc = yaml(content);
        expect(doc).toEqual({ config: "prefix-test-suffix" });
      });
    });
    describe("When passing a self reference", () => {
      xit("Should replace self var with it's value", () => {
        const content = Buffer.from(
          ["version: 1", "config: version-${self:version}"].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({ version: 1, config: "version-1" });
      });
    });
    describe("When passing a self reference with null value", () => {
      xit("Should return prefix plus replace self var with null", () => {
        const content = Buffer.from(
          ["version: null", "config: version-${self:version}"].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({ version: null, config: "version-null" });
      });
      xit("Should replace self var with null", () => {
        const content = Buffer.from(
          ["version: null", "config: ${self:version}"].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({ version: null, config: null });
      });
    });
    describe("When passing a file reference with env references", () => {
      xit("Should replace value with file content", () => {
        const content = Buffer.from(
          "config: ${file(src/__mocks__/file-env.yml)}"
        );
        const doc = yaml(content);
        expect(doc).toEqual({ config: { key: "value-test" } });
      });
    });
    describe("When passing a file reference with self references", () => {
      xit("Should replace value with file content", () => {
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
      xit("Should replace value with file content", () => {
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
      xit("Should replace value with file content", () => {
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

    describe("When passing boolean values", () => {
      xit("Should cast boolean:true values properly", () => {
        const content = Buffer.from(
          [
            "is-enabled: true",
            "isEnabled: ${self:is-enabled}",
            "title: Feature enabled=${self:is-enabled}"
          ].join("\n")
        );
        const expected = {
          "is-enabled": true,
          isEnabled: true,
          title: "Feature enabled=true"
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });

      xit("Should cast boolean:false values properly", () => {
        const content = Buffer.from(
          [
            "is-enabled: false",
            "isEnabled: ${self:is-enabled}",
            "title: Feature enabled=${self:is-enabled}"
          ].join("\n")
        );
        const expected = {
          "is-enabled": false,
          isEnabled: false,
          title: "Feature enabled=false"
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });
    });
  });

  describe("YAML extended exception test suite", () => {
    describe("When passing an unknown function reference", () => {
      xit("Should throw unknonw reference error", () => {
        const content = Buffer.from(
          "config: ${unknown(src/__mocks__/file.yml)}"
        );

        expect(() => {
          yaml(content);
        }).toThrowError(
          `Unknonw reference error, "unknown" is not a known reference name`
        );
      });
    });

    describe("When passing integer values", () => {
      xit("Should cast integer values properly", () => {
        const content = Buffer.from(
          [
            "replicas: 3",
            "numReplicas: ${self:replicas}",
            "title: No of replicas=${self:replicas}"
          ].join("\n")
        );
        const expected = {
          replicas: 3,
          numReplicas: 3,
          title: "No of replicas=3"
        };
        const doc = yaml(content);
        expect(doc).toEqual(expected);
      });
    });

    describe("When passing an unknown variable reference", () => {
      xit("Should throw unknonw reference error", () => {
        const content = Buffer.from("config: ${unknown:my.var}");

        expect(() => {
          yaml(content);
        }).toThrowError(
          `Unknonw reference error, "unknown" is not a known reference name`
        );
      });
    });

    describe("When passing an list with file reference", () => {
      xit("Should return concatenated list", () => {
        const content = Buffer.from(
          [
            "list:",
            "  - item 1",
            "  - ${file(src/__mocks__/file.yml)}",
            "  - item 2"
          ].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({
          list: ["item 1", { key: "value" }, "item 2"]
        });
      });
    });

    describe("When passing an list with variable reference", () => {
      xit("Should return concatenated list", () => {
        const content = Buffer.from(
          [
            "name: variable-list",
            "version: 1",
            "list:",
            "  - item 1",
            "  - ${global:name}",
            "  - ${self:version}",
            "  - ${env:NODE_ENV}",
            "  - item 2"
          ].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({
          name: "variable-list",
          version: 1,
          list: ["item 1", "variable-list", 1, "test", "item 2"]
        });
      });
    });

    describe("When passing a list of object with variable reference", () => {
      xit("Should return concatenated list", () => {
        const content = Buffer.from(
          [
            "name: variable-list",
            "version: 1",
            "list:",
            "  - key1: item 1",
            "  - key2: ${global:name}",
            "  - key3: ${self:version}",
            "  - key4: ${env:NODE_ENV}",
            "  - key5: item 2"
          ].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({
          name: "variable-list",
          version: 1,
          list: [
            { key1: "item 1" },
            { key2: "variable-list" },
            { key3: 1 },
            { key4: "test" },
            { key5: "item 2" }
          ]
        });
      });
    });

    describe("When passing a list of object with file reference", () => {
      xit("Should return concatenated list", () => {
        const content = Buffer.from(
          [
            "name: variable-list",
            "version: 1",
            "list:",
            "  - key1: item 1",
            "  - key2: ${file(src/__mocks__/file.yml)}",
            "  - key3: item 2"
          ].join("\n")
        );
        const doc = yaml(content);
        expect(doc).toEqual({
          name: "variable-list",
          version: 1,
          list: [
            { key1: "item 1" },
            { key2: { key: "value" } },
            { key3: "item 2" }
          ]
        });
      });
    });
    // describe("When passing a git:branch command", () => {
    //   xit("Should return result of command", () => {
    //     const content = Buffer.from("branch: ${git:branch}");
    //     const result = yaml(content);
    //     expect(result).toEqual({ branch: "master" });
    //   });
    // });

    describe("When passing a git:sha1 command", () => {
      xit("Should return result of command", () => {
        const content = Buffer.from("sha1: ${git:sha1}");
        const result = yaml(content);
        expect(result.sha1).toBeDefined();
      });
    });
  });

  describe("Multi template syntax test suite", () => {
    describe("When passing a multiple template syntax", () => {
      xit("Should evaluate all templates", () => {
        const content = Buffer.from(
          [
            "name: service-name",
            "version: 1",
            "description: ${self:name}@${self:version}"
          ].join("\n")
        );
        const result = yaml(content);

        expect(result).toEqual({
          name: "service-name",
          version: 1,
          description: "service-name@1"
        });
      });
    });
  });

  describe("Helm template syntax test suite", () => {
    describe("When passing a helm template syntax", () => {
      xit("Should pass-through those syntax", () => {
        const content = Buffer.from("replicas: ${helm:'.Values.replicas'}");
        const result = yaml(content);
        expect(result.replicas).toBe("'{{ .Values.replicas }}'");
      });
      xit("Should pass-through utf-8 encoding", () => {
        const content = Buffer.from(
          "template: ${file(./src/__mocks__/helm-template.yml, utf-8)}"
        );
        const result = yaml(content);
        expect(result.template).toBe(
          "image: {{ .Values.image.repository }}:{{ .Values.image.tag }}\n"
        );
      });
      xit("Should pass-through multiple syntax", () => {
        const content = Buffer.from(
          "template: ${file(./src/__mocks__/helm-template.yml, helm)}"
        );
        const result = yaml(content);
        expect(result.template).toBe(
          "image: {{ .Values.image.repository }}:{{ .Values.image.tag }}\n"
        );
      });
      xit("Should pass-through and compile ${} templates syntax", () => {
        const content = Buffer.from(
          "template: ${file(./src/__mocks__/helm-template-dynamic.yml, helm)}"
        );
        const result = yaml(content);
        expect(result.template).toBe(
          [
            "version: 1",
            "name: micro-service",
            "image: ",
            "  repository: {{ .Values.image.repository }}",
            "  tag: {{ .Values.image.tag }}-1",
            "metadata: ",
            "  label: micro-service",
            "  hosts: ",
            "    - domain",
            "    - {{ .Values.host }}",
            ""
          ].join("\n")
        );
      });
    });
  });

  describe("Replace test suite", () => {
    describe("When passing a string and replace pattern", () => {
      it("Should replace string", () => {
        const content = Buffer.from(
          [
            "name: service",
            "version: v1.0.2",
            "subset: service-${replace(${self:version},.,-)}"
          ].join("\n")
        );
        const result = yaml(content);
        expect(result.replicas).toBe("'{{ .Values.replicas }}'");
      });
    });
  });
});
