import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useGetMcpToolsQuery,
  useGetMcpDemoQuery,
} from "../features/api/catsApi";
import {
  Bot,
  Sparkles,
  Send,
  Terminal,
  Loader2,
  Cpu,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentChat() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **Tiny Cats AI Agent**, powered by Groq and connected to our live **Model Context Protocol (MCP)** tools. Ask me about cat care, adoption, or finding a cattery.",
    },
  ]);

  const { getToken, isSignedIn } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const { data: mcpTools, isLoading: toolsLoading } = useGetMcpToolsQuery();
  const [runDemo, setRunDemo] = useState(false);
  const { data: demoData, isLoading: demoLoading } = useGetMcpDemoQuery(
    { kidsFriendly: true, apartmentFriendly: true },
    { skip: !runDemo }
  );

  useEffect(() => {
    let active = true;
    let socket: Socket | undefined;

    if (!isSignedIn) return;
    void getToken()
      .then((token) => {
        if (!active || !token) return;
        socket = io(
          import.meta.env.VITE_SOCKET_URL || window.location.origin,
          { auth: { token } },
        );
        socketRef.current = socket;
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));
        socket.on("connect_error", (error: Error) => {
          setIsConnected(false);
          toast.error(`AI connection failed: ${error.message}`);
        });
        socket.on("agent:response", (response: { answer: string }) => {
          setIsAsking(false);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: response.answer },
          ]);
        });
        socket.on("agent:error", (error: { message?: string }) => {
          setIsAsking(false);
          const message = error.message || "AI agent request failed";
          toast.error(message);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `⚠️ ${message}` },
          ]);
        });
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Could not read sign-in token",
          );
        }
      });

    return () => {
      active = false;
      socket?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [getToken, isSignedIn]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputPrompt.trim();
    if (!text || isAsking) return;
    if (!socketRef.current?.connected) {
      toast.error("AI agent is not connected yet. Please try again in a moment.");
      return;
    }

    setInputPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsAsking(true);
    socketRef.current.emit("agent:message", {
      message: text,
      history: messages.slice(1).map((message) => ({
        role: message.role,
        text: message.content,
      })),
    });
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-96 h-96 bg-secondary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              Autonomous MCP Protocol
            </span>
            <span className="text-xs text-outline font-medium">Socket.IO • Groq</span>
          </div>

          <h1 className="font-headline-xl text-3xl sm:text-4xl font-bold text-on-surface">
            Ask AI Agent & MCP Explorer
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Chat with the Groq-powered agent over an authenticated Socket.IO connection, or inspect the Model Context Protocol tools it can use.
          </p>
        </div>

        {/* 2-Column Layout: Chat on Left, MCP Tools on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chat Window (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-surface-container rounded-2xl border border-surface-container-high/60 shadow-xl overflow-hidden h-[620px]">
            {/* Chat Header */}
            <div className="p-4 bg-surface-container-high/80 border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Tiny Cats Assistant</h3>
                  <span className={`text-[11px] flex items-center gap-1 ${isConnected ? "text-secondary" : "text-outline"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-secondary" : "bg-outline"}`}></span> {isConnected ? "Connected • Groq" : "Connecting…"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-surface-variant text-primary"
                      }`}
                    >
                      {isUser ? "You" : "AI"}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary-container text-on-primary-container rounded-tr-sm"
                          : "bg-surface-container-high text-on-surface rounded-tl-sm border border-surface-variant/40"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {isAsking && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-variant text-primary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-high text-on-surface-variant rounded-2xl p-3 text-xs flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Groq agent is thinking…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-surface-container-low border-t border-surface-container-high flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about cat care, apartment breeds, diets…"
                disabled={isAsking}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm placeholder:text-outline border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isAsking}
                className="p-2.5 rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* MCP Tools Inspector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tools list card */}
            <div className="bg-surface-container rounded-2xl p-6 border border-surface-container-high/60 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-tertiary" />
                  <h3 className="font-bold text-base text-on-surface">Registered MCP Tools</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-variant text-xs font-semibold text-outline">
                  {mcpTools?.length || 2} tools
                </span>
              </div>

              {toolsLoading && (
                <div className="py-6 flex justify-center text-outline">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
                    <Wrench className="w-3.5 h-3.5 text-primary" />
                    <span>recommend_cats</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Filters the live MongoDB database using client lifestyle preferences (kids, apartment, energy, size).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-2 font-mono text-xs text-secondary font-bold">
                    <Wrench className="w-3.5 h-3.5 text-secondary" />
                    <span>get_all_cats</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Retrieves full facts on all cats currently in the shelter catalog.
                  </p>
                </div>
              </div>

              {/* Run MCP Protocol Test */}
              <div className="pt-2 border-t border-surface-container-high/60">
                <button
                  type="button"
                  disabled={demoLoading}
                  onClick={() => setRunDemo(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-surface-variant"
                >
                  {demoLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-tertiary" />
                  )}
                  <span>Test MCP Tool Calling Live</span>
                </button>

                {demoData && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#100e0b] border border-secondary/30 text-xs space-y-2">
                    <span className="text-secondary font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Stdio Execution Success
                    </span>
                    <p className="text-on-surface-variant line-clamp-3">
                      {demoData.aiResponse || JSON.stringify(demoData)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* How MCP works box */}
            <div className="p-5 rounded-2xl bg-surface-container border border-surface-container-high/60 shadow-xl space-y-2">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider">
                Architecture Note
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                The MCP client runs in the Express backend and communicates via <code className="text-primary bg-surface-container-low px-1 py-0.5 rounded">stdio</code> with the MCP server process in <code className="text-primary bg-surface-container-low px-1 py-0.5 rounded">mcp_server</code>. This provides standardized, sandboxed tool invocation for any LLM client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
