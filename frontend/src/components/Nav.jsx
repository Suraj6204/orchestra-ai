import { MessageSquare } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  return (
    <>
      {selectedConversation && (
        <div className="h-14 flex items-center gap-2.5  px-5 border-b border-[var(--border)] bg-[var(--bg-chat)]">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[rgba(32,199,122,0.12)] border border-[rgba(32,199,122,0.22)]">
            <MessageSquare size={13} className="text-[var(--primary)]" />
          </div>
          <div className="text-[14px] font-semibold text-[var(--text-main)] tracking-tight">
            {selectedConversation?.title || "New Chat"}
          </div>
          <div className="text-[10px] font-medium text-[var(--bg-main)] bg-[var(--primary)] border border-[var(--primary)] px-2 py-0.5 rounded-full">
            {messages?.length} Messages
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
