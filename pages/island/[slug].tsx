import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";

interface Island {
  slug: string;
  name: string;
  description: string;
}

interface IslandPageProps {
  island: Island;
}

export default function IslandPage({ island }: IslandPageProps) {
  const [tab, setTab] = useState<"weather" | "services">("weather");

  return (
    <div style={{ padding: 20 }}>
      <h2>{island.name}</h2>
      <p>{island.description}</p>

      {/* Tab buttons */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        <button
          className={tab === "weather" ? "tab active" : "tab"}
          onClick={() => setTab("weather")}
        >
          Weather
        </button>
        <button
          className={tab === "services" ? "tab active" : "tab"}
          onClick={() => setTab("services")}
        >
          Services
        </button>
      </div>

      {/* Tab content */}
      <section className="card" style={{ marginTop: 12 }}>
        {tab === "weather" && (
          <>
            <h4 style={{ margin: "0 0 8px" }}>Weather</h4>
            <div className="muted small">Auto-detected for {island.name}</div>
            <div>Weather widget or data goes here…</div>
          </>
        )}

        {tab === "services" && (
          <>
            <h4 style={{ margin: "0 0 8px" }}>Local Services</h4>
            <div className="muted small" style={{ marginBottom: 8 }}>
              Auto-detected for {island.name}
            </div>
            <div className="row" style={{ gap: 12 }}>
              <div className="service">Service 1</div>
              <div className="service">Service 2</div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/**
 * Example static paths – replace with your actual island slugs
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: "st-kitts" } }, { params: { slug: "nevis" } }],
    fallback: false,
  };
};

/**
 * Example static props – replace with real data fetching
 */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const island: Island = {
    slug,
    name: slug.replace("-", " ").toUpperCase(),
    description: `This is some information about ${slug}.`,
  };

  return {
    props: { island },
  };
};

