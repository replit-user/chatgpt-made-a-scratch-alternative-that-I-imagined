import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VPLEditor() {
  const [ast, setAst] = useState({
    metadata: { version: "1.0.0" },
    "builtin.startnode": [
      { "builtin.varnode": { name: "variable", value: 7 } },
      { "builtin.printnode": { value: "Hello from start" } }
    ]
  });
  const [output, setOutput] = useState("");

  // --- Compiler ---
  function compileAST(ast) {
    let lines = [];
    lines.push("[META]");
    lines.push("v" + ast.metadata.version);
    lines.push("[META_END]");
    let nodeId = 1;
    for (const node of ast["builtin.startnode"]) {
      lines.push("NODE_" + nodeId + ":");
      if (node["builtin.varnode"]) {
        let n = node["builtin.varnode"];
        lines.push(`VAR ${n.name} ${n.value}`);
      }
      if (node["builtin.printnode"]) {
        let n = node["builtin.printnode"];
        lines.push(`PRINT ${JSON.stringify(n.value)}`);
      }
      nodeId++;
    }
    return lines.join("\n");
  }

  // --- Interpreter ---
  function runIR(ir) {
    let lines = ir.split("\n");
    let output = "";
    let vars = {};
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith("VAR ")) {
        let [, name, val] = line.split(" ");
        vars[name] = val;
      }
      if (line.startsWith("PRINT ")) {
        let msg = line.substring(6);
        try {
          msg = JSON.parse(msg);
        } catch {}
        output += msg + "\n";
      }
    }
    return output;
  }

  // --- Run button ---
  function handleRun() {
    const ir = compileAST(ast);
    const out = runIR(ir);
    setOutput(out);
  }

  return (
    <div className="p-4 grid gap-4">
      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-bold mb-2">VPL Editor</h2>
          <p>Nodes (example):</p>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(ast, null, 2)}
          </pre>
          <Button onClick={handleRun} className="mt-2">Run</Button>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-bold">Output</h2>
          <pre className="bg-black text-white p-2 rounded min-h-[100px]">
            {output}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
