import classNames from "classnames";
import React from "react";

import { LOGO } from "@calcom/lib/constants";

import Loader from "@components/Loader";
import { HeadSeo } from "@components/seo/head-seo";

interface Props {
  title: string;
  description: string;
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f3f4f6] py-12 sm:px-6 lg:px-8">
      <HeadSeo title={props.title} description={props.description} />
      <div className={classNames(props.showLogo ? "text-center" : "", "sm:mx-auto sm:w-full sm:max-w-md")}>
        {props.showLogo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img style={{ width: 400, height: 80 }} className="mb-auto h-4" src={LOGO} alt="Cal.com Logo" />
        )}
        {props.heading && <h2 className="font-cal text-center text-3xl text-sky-800">{props.heading}</h2>}
      </div>
      {props.loading && (
        <div className="absolute z-50 flex h-screen w-full items-center bg-gray-50">
          <Loader />
        </div>
      )}
      <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-1 mx-2 rounded-md border-gray-200 bg-white px-4 py-10 sm:px-10">
          {props.children}
        </div>
        <div className="mt-8 text-center text-sm text-neutral-600">{props.footerText}</div>
      </div>
    </div>
  );
}
