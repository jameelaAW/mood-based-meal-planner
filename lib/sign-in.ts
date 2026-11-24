import { NextResponse } from "next/server";

/**
 * Every meal feature (free and Full Access) needs a signed-in account, so
 * subscribers are on the email list. Returned by the meal APIs when there's no
 * session; the UI turns it into a sign-in prompt. Pricing and the Payhip
 * checkout stay open without an account.
 */
export function signInRequired() {
  return NextResponse.json(
    { error: "sign_in_required", message: "Sign in free to get your meal ideas." },
    { status: 401 },
  );
}
