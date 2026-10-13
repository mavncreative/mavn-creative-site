import type { Metadata } from "next";
import AgentsLanding from "./AgentsLanding";

export const metadata: Metadata = {
  title: "Personal Brand Content for Twin Cities Agents | MAVN Creative",
  description:
    "A strategy-first content shoot for Twin Cities real estate agents. Brand discovery, scripting, a directed shoot, and cinematic reels that make your market know your name.",
  openGraph: {
    title: "Become the agent your market knows | MAVN Creative",
    description:
      "Brand discovery, scripting, a directed shoot, and cinematic reels for Twin Cities real estate agents.",
    type: "website",
  },
};

export default function AgentsPage() {
  return <AgentsLanding />;
}
