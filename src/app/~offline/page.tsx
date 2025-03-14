import Head from "next/head";

export default function Offline() {
  return (
    <>
      <Head>
        <title>Urems ERP</title>
      </Head>
      <h1>This is offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
    </>
  );
}