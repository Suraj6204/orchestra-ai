import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "OrchestraAI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order?.id,
        handler: async (response) => {
          try {
            const data = await verifyPayment(response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#20C77A",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          {" "}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] bg-[var(--bg-secondary)] border-l border-[var(--border)] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div>
                <div className="text-[var(--text-main)] text-lg font-semibold">
                  Billing
                </div>
                <div className="text-[var(--text-muted)] text-sm">
                  Plans & Credits
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-input)] flex items-center justify-center"
              >
                <X size={18} className="text-[var(--text-main)]" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[var(--text-muted)] text-sm">
                      Current Plan
                    </p>
                    <h3 className="text-[var(--text-main)] text-xl font-bold">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <Crown className="text-[var(--neon)]" />
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-2">
                    <span>Credits</span>
                    <span>
                      {userData.credits || 0}/{userData.totalCredits || 100}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-[var(--bg-input)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] transition-all duration-500"
                      style={{
                        width: `${
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <h3 className="text-[var(--text-main)] font-semibold">
                  Starter Plan
                </h3>
                <p className="text-[var(--primary)] text-2xl font-bold mt-2">
                  ₹199
                </p>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  500 Credits
                </p>
                <button
                  className="mt-4 w-full rounded-lg bg-[var(--primary)] hover:bg-[var(--hover)] py-2 text-[#02140C] font-medium"
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade
                </button>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <h3 className="text-[var(--text-main)] font-semibold">
                  Pro Plan
                </h3>
                <p className="text-[var(--primary)] text-2xl font-bold mt-2">
                  ₹499
                </p>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  1000 Credits
                </p>
                <button
                  className="mt-4 w-full rounded-lg bg-[var(--primary)] hover:bg-[var(--hover)] py-2 text-[#02140C] font-medium"
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
