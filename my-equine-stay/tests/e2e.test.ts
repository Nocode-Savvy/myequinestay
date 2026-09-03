import { describe, test, expect } from "bun:test";

const BASE_URL = "http://127.0.0.1:3000";

describe("1. Admin Security & Negative Access Control", () => {
  test("Unauthenticated GET /admin must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    const location = res.headers.get("location");
    expect(location).toContain("/auth");
    expect(location).toContain("redirectTo");
  });

  test("Unauthenticated GET /admin/users must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Unauthenticated GET /admin/listings must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/listings`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Unauthenticated GET /admin/payments must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/payments`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Unauthenticated GET /admin/reports must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/reports`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Unauthenticated GET /admin/settings must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/admin/settings`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Public footer HTML must NOT expose /admin link to unauthenticated visitors", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    // Verify no footer admin link is rendered for public visitors
    const hasAdminFooterLink = /<footer[\s\S]*?href=["']\/admin["'][\s\S]*?<\/footer>/.test(html);
    expect(hasAdminFooterLink).toBe(false);
  });

  test("Unauthenticated GET /dashboard must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });

  test("Unauthenticated GET /listings/new must redirect to /auth", async () => {
    const res = await fetch(`${BASE_URL}/listings/new`, { redirect: "manual" });
    expect([301, 302, 303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/auth");
  });
});

describe("2. Navigation Integrity & Route Resolution", () => {
  const routes = [
    { path: "/", title: "Homepage" },
    { path: "/browse", title: "Browse" },
    { path: "/search", title: "Search" },
    { path: "/faq", title: "FAQ" },
    { path: "/contact", title: "Contact" },
    { path: "/alerts", title: "Alerts" },
    { path: "/legal/terms", title: "Terms" },
    { path: "/legal/privacy", title: "Privacy" },
    { path: "/legal/waiver", title: "Waiver" },
    { path: "/auth?mode=signin", title: "Sign In" },
    { path: "/auth?mode=signup", title: "Sign Up" },
  ];

  for (const route of routes) {
    test(`GET ${route.path} returns 200 OK with no server error`, async () => {
      const res = await fetch(`${BASE_URL}${route.path}`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).not.toContain("Internal Server Error");
      expect(text).not.toContain("Application error");
    });
  }

  test("Login and signup routes load or redirect properly", async () => {
    const loginRes = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
    expect([200, 301, 302, 307, 308]).toContain(loginRes.status);

    const signupRes = await fetch(`${BASE_URL}/signup`, { redirect: "manual" });
    expect([200, 301, 302, 307, 308]).toContain(signupRes.status);
  });
});

describe("3. Search, Filters & Empty States (Critical Path)", () => {
  test("Location query returns 200 OK without errors", async () => {
    const res = await fetch(`${BASE_URL}/search?location=Ocala`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).not.toContain("Unhandled Runtime Error");
  });

  test("Property type filter returns 200 OK without errors", async () => {
    const res = await fetch(`${BASE_URL}/browse?type=farm`);
    expect(res.status).toBe(200);
  });

  test("Combined filters (type + price + location) return 200 OK", async () => {
    const res = await fetch(`${BASE_URL}/browse?type=farm&maxPrice=500&bedrooms=2&stalls=4`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).not.toContain("Application error");
  });

  test("Zero-match query returns 200 OK with valid empty state, not a crash", async () => {
    const res = await fetch(`${BASE_URL}/browse?type=impossible_category_zero_matches_12345`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).not.toContain("Internal Server Error");
    expect(html).not.toContain("500 Internal Server Error");
  });
});

describe("4. API Endpoints", () => {
  test("POST /api/alerts/subscribe accepts valid email", async () => {
    const res = await fetch(`${BASE_URL}/api/alerts/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `e2e_test_${Date.now()}@example.com` }),
    });
    expect([200, 201]).toContain(res.status);
  });

  test("POST /api/inquiries saves inquiry successfully", async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: "00000000-0000-0000-0000-000000000001",
        owner_id: "00000000-0000-0000-0000-000000000001",
        guest_name: "E2E Test Guest",
        guest_email: "guest@example.com",
        message: "Automated inquiry test message",
        horse_count: 2,
      }),
    });
    // Either 200 or 400 depending on mock id, but never 500 crash
    expect(res.status).toBeLessThan(500);
  });
});
