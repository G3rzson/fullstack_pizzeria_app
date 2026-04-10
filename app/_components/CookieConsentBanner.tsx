"use client";

import Link from "next/link";
import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Elfogadom"
      declineButtonText="Elutasítom"
      enableDeclineButton
      cookieName="pizzeria_cookie_consent"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
      buttonStyle={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "8px 16px",
      }}
      declineButtonStyle={{
        background: "var(--secondary)",
        color: "var(--secondary-foreground)",
        fontSize: "14px",
        borderRadius: "6px",
        padding: "8px 16px",
      }}
      expires={1} // Cookie expires in 1 day
    >
      <span style={{ fontSize: "14px", color: "var(--foreground)" }}>
        Ez az oldal sütiket használ a jobb felhasználói élmény érdekében.{" "}
        <Link href="/privacy" className="underline text-primary">
          További információ
        </Link>
      </span>
    </CookieConsent>
  );
}
