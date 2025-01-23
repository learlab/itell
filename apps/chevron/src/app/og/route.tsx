import { ImageResponse } from "next/og";
import { volume } from "#content";

import { env } from "@/env.mjs";

const size = {
  width: 1200,
  height: 630,
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const isDashboard = url.searchParams.get("dashboard") === "true";
  const isAuth = url.searchParams.get("auth") === "true";

  const heading = url.searchParams.get("title") ?? volume.title;
  const slug = url.searchParams.get("slug");

  const header = isDashboard
    ? `${env.NEXT_PUBLIC_HOST}/dashboard`
    : isAuth
      ? `${env.NEXT_PUBLIC_HOST}/auth`
      : slug
        ? `${env.NEXT_PUBLIC_HOST}/${slug}`
        : env.NEXT_PUBLIC_HOST;

  console.log(url.searchParams.get("description"));
  const footer =
    url.searchParams.get("description") ||
    (isDashboard
      ? "Learning statistics"
      : isAuth
        ? "Getting started"
        : slug
          ? `A chapter from "${volume.title}"`
          : "");

  const font = fetch(
    new URL("/fonts/kaisei-tokumin-bold.ttf", env.NEXT_PUBLIC_HOST)
  ).then((res) => res.arrayBuffer());

  const image = fetch(new URL("/images/itell.png", env.NEXT_PUBLIC_HOST)).then(
    (res) => res.arrayBuffer()
  );
  const fontData = await font;

  const imageData = await image;

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(to bottom right, #2d1b4e, #1c1c28, #1e3a5f)",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "40px 40px",
        }}
      >
        <header
          style={{
            fontSize: 20,
            fontStyle: "normal",
            color: "gray",
          }}
        >
          <p>{header}</p>
          <p style={{ marginLeft: "auto" }}>
            An intelligent textbook by LearLab
          </p>
        </header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="96"
            height="96"
            // @ts-expect-error imageData is an ArrayBuffer
            src={imageData}
            alt="itell icon"
          />
          <h1
            style={{
              fontSize: 60,
              whiteSpace: "pre-wrap",
              fontFamily: "Kaisei Tokumin",
              letterSpacing: "-0.05em",
              fontStyle: "normal",
              color: "white",
            }}
          >
            {heading}
          </h1>
        </div>

        {isDashboard ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            height="250"
            style={{ marginTop: "auto", width: "100%" }}
            // @ts-expect-error imageData is an ArrayBuffer
            src={await fetch(
              new URL("../../../public/images/chart.png", import.meta.url)
            ).then((res) => res.arrayBuffer())}
            alt="example line chart"
          />
        ) : null}
        <footer
          style={{
            display: "flex",
            color: "white",
            marginTop: "auto",
            fontSize: 24,
          }}
        >
          <p>{footer}</p>
        </footer>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Kaisei Tokumin",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
};
