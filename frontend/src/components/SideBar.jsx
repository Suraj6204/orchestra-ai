import React from "react";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenBoxIcon,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";

import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import BillingDrawer from "./BillingDrawer";
function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, [userData?._id]);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border)] py-4 gap-1 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--primary)] hover:text-[var(--hover)] hover:bg-[rgba(32,199,122,0.08)] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[var(--primary)] hover:text-[var(--hover)] hover:bg-[rgba(32,199,122,0.08)] transition-colors duration-150 bg-transparent border-none cursor-pointer "
          onClick={() => dispatch(setSelectedConversation(null))}
        >
          <Plus size={17} />
        </button>

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv?._id;
            return (
              <div
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                ${
                  isActive
                    ? "bg-[rgba(32,199,122,0.12)] border-[rgba(32,199,122,0.22)]"
                    : "bg-transparent border-transparent"
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
                ${isActive ? "bg-[rgba(32,199,122,0.16)] text-[var(--primary)]" : "bg-[rgba(32,199,122,0.06)] text-[var(--primary)]"}`}
                >
                  <MessageSquare size={13} />
                </div>
              </div>
            );
          })}
        </div>

        <div className='"relative shrink-0'>
          {userData?.avatar && !imageError ? (
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              src={userData?.avatar}
              alt={"image"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-sidebar)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors duration-150 cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={14} />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <div
        className={` fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-(--bg-sidebar) border-r border-(--border) transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-(--border)">
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-(--primary) hover:text-(--hover) hover:bg-[rgba(32,199,122,0.08)] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftIcon />
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-(--text-muted) hover:text-(--text-main) hover:bg-(--bg-hover) transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <X />
            </button>
            <span className="text-[16px] font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--neon)] bg-clip-text text-transparent tracking-widest drop-shadow-[0_0_8px_rgba(32,199,122,0.3)] flex-1">
              OrchestraAI
            </span>
            <span className="text-[10px] font-medium text-(--bg-main) bg-(--primary) border border-(--primary) px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-(--text-muted) hover:text-(--text-main) hover:bg-(--bg-hover) transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => dispatch(setSelectedConversation(null))}
            > 
              <PenSquare size={14} />
            </button>
          </div>

          <div className="px-4 pt-4 pb-1">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[#02140C] bg-[var(--primary)] rounded-xl py-[10px] border-none cursor-pointer hover:bg-[var(--hover)] transition-opacity duration-150"
              onClick={() => dispatch(setSelectedConversation(null))}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {conversations.length == 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No Recent Conversations
            </div>
          ) : (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              Recents
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations?.map((conv, i) => {
              const isActive = selectedConversation?._id == conv?._id;
              return (
                <div
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                ${
                  isActive
                    ? "bg-[rgba(32,199,122,0.12)] border-[rgba(32,199,122,0.24)]"
                    : "bg-transparent border-transparent"
                }`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
                ${isActive ? "bg-[rgba(32,199,122,0.16)] text-[var(--primary)]" : "bg-white/[0.05] text-[var(--text-muted)]"}`}
                  >
                    <MessageSquare size={13} />
                  </div>
                  <span
                    className={`text-[13px] font-medium truncate ${isActive ? "text-[var(--text-main)]" : "text-[var(--text-main)] opacity-80"}`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-2.5 h-px bg-[var(--border)]" />
          <div className="px-3.5 py-3.5">
            {userData ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-[var(--primary)]/30"
                      src={userData?.avatar}
                      alt={"image"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-[var(--text-main)] truncate">
                    {userData?.name || "user"}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-px">
                    {`${userData?.plan}` || "free plan"}{" "}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowBilling(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-[var(--neon)] cursor-pointer hover:bg-white/[0.08] hover:text-[var(--text-main)] transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-[var(--text-muted)] cursor-pointer hover:bg-white/[0.08] hover:text-[var(--text-main)] transition-all duration-150"
                    onClick={() => {
                      logOut();
                      dispatch(setUserdata(null));
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl py-[11px] cursor-pointer hover:bg-[var(--bg-input)] transition-colors duration-150">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}

export default SideBar;
