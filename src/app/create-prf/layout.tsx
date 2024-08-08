import Link from "next/link";
import React from "react";

type Props = {};

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row hidden">
        <div>Header</div>
        <Link href={"/create-prf"}>/</Link>
      </div>
      <div className="w-full overflow-auto">{children}</div>
    </div>
  );
}

export default Layout;
