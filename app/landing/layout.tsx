import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask My Docs — Production RAG Landing Page",
  description: "Award-winning production RAG landing page for LangChain & LangGraph documentation with cross-encoder reranking and self-check grounding.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
