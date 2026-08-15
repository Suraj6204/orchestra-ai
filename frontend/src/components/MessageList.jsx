import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);
  const bottemRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      bottemRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-[var(--bg-chat)]">
      {messages.length == 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold bg-gradient-to-r from-[var(--primary)] via-[#25E88A] to-[var(--neon)] bg-clip-text text-transparent tracking-wider drop-shadow-[0_0_12px_rgba(32,199,122,0.25)]">
              OrchestraAI
            </h1>
            <p className="text-[15px] font-semibold text-[var(--text-muted)] tracking-tight">
              How can I help you?
            </p>
            <p className="text-[13px] text-[var(--text-muted)] max-w-[260px] leading-relaxed">
              Ask me anything — code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Write a Netflix clone",
              "Explain Redis",
              "Build a dashboard",
            ].map((s) => (
              <button className="text-[12px] text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] px-3.5 py-1.5 rounded-lg hover:bg-[var(--bg-input)] hover:text-[var(--text-main)] transition-colors duration-150 cursor-pointer">
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages?.map((msg, i) => (
            <div>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg.images || []}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}
      <div ref={bottemRef} />
    </div>
  );
}

export default MessageList;
