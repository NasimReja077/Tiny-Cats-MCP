import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";

let client: Client | null = null;
let connecting: Promise<Client> | null = null;

export const getMcpClient = async (): Promise<Client> => {
  // Reuse existing client
  if (client) return client;

  // Avoid parallel double-connect
  if (connecting) return connecting;

  connecting = (async () => {
    const mcpEntry = path.resolve(
      process.cwd(),
      "../mcp_server/src/index.ts"
    );

    const transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", mcpEntry],
    });

    const c = new Client({
      name: "tiny-cats-client",
      version: "1.0.0",
    });

    await c.connect(transport);
    client = c;
    connecting = null;
    return c;
  })();

  return connecting;
};

/** Optional: call a tool in one line */
export const callMcpTool = async (
  name: string,
  args: Record<string, unknown> = {}
) => {
  const c = await getMcpClient();
  return c.callTool({ name, arguments: args });
};

export const listMcpTools = async () => {
  const c = await getMcpClient();
  return c.listTools();
};