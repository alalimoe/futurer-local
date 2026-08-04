# Support SOP — Delivery Failures, Refunds & Courtesy Credits

**Internal use only.** Adopt these rules for all support channels (email, WhatsApp, chat). Public-facing copy lives in theme snippets and `/pages/shipping-and-returns`.

**Entity:** Nootropix M.E. Para Pharmaceutical Products Trading · License 1613040  
**Contact:** support@nootropix.shop · +971 52 598 8940

---

## 1. Decision tree (first response)

```
Customer reports non-delivery or delivery problem
│
├─ Order still in transit / within SLA?
│   └─ Provide tracking link. Set expectation per zone (Dubai ≤4h, UAE next-day, KSA 3–5 biz days, intl customs-dependent).
│
├─ Carrier shows delivered but customer denies receipt?
│   └─ Request proof-of-delivery photo if available. Open carrier investigation. Do not refund until carrier confirms loss OR 7 calendar days after "delivered" scan with no POD.
│
├─ Our fault (mispack, wrong label, courier error on our instructions)?
│   └─ Full refund OR reship at customer choice. See §3.
│
├─ UAE local RTO after re-attempts (undeliverable, not customer refusal)?
│   └─ Offer reship OR full refund. See §4.
│
├─ International customs seizure / hold / return to sender (customs)?
│   └─ No refund. Explain import risk. Courtesy credit only per §5.
│
└─ Customer-caused (wrong address, refused delivery, unclaimed)?
    └─ No automatic refund. Offer reship at customer expense if stock available.
```

---

## 2. Refund timelines (customer-facing + internal)

| Stage | Timeline | Internal action |
|---|---|---|
| Return received + inspected | Refund issued within **7–14 business days** | Inspect seal/condition same day as receipt |
| Non-delivery (our fault / confirmed lost) | Refund after carrier status verified | May take **+3–7 business days** beyond standard return window |
| Original payment method | Always | Never offer store credit unless customer explicitly prefers it |
| Shipping charges | Non-refundable except our error or legal requirement | Document reason in order note |

**Do not promise:** "instant refund", "same-day refund", or "no questions asked".

---

## 3. Our-fault delivery failure (full refund)

**Qualifying errors:** wrong item shipped, incorrect label, courier error on our instructions, package never handed to carrier.

**Process:** verify in Quiqup logs → offer full refund or reship → tag `delivery-our-fault`.

---

## 4. UAE local delivery failure (RTO)

Confirm RTO in Quiqup → offer **reship (free)** or **full refund** → tag `delivery-uae-rto`.

---

## 5. Courtesy store credit (discretionary — international customs)

**Eligible when:** first occurrence, international only, customs seizure/hold (not our shipping error).

**Limits:** max **15% of order** or **100 AED**; one-time per customer; manager approval required.

**Script:** Import rules are the buyer's responsibility. We cannot refund customs seizures. As a one-time courtesy on your first order, I can offer a [amount] store credit — not guaranteed for future orders.

---

## 6. Customer-caused failures

Wrong address → reship at customer cost. Refused delivery → no refund. Changed mind after dispatch → standard 30-day unopened return policy.

---

## 7. Returns (standard)

30 days from delivery · unopened/sealed only · free return shipping · refund 7–14 business days after inspection.

---

## 8. Phrases to avoid (GMC risk)

| Never say | Say instead |
|---|---|
| "No questions asked refund" | "Full refund when delivery fails due to our error" |
| "3-day returns" | "30-day returns on unopened items" |
| "GMP certified" | "cGMP-aligned practices" |
| "99%+ purity on all products" | "Per-batch COA available on request" |

---

*Last updated: 2026-08-03. Align with `docs/gmc/canonical-policies.md`.*
