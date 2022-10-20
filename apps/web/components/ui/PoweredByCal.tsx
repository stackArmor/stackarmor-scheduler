import Link from "next/link";

import { useIsEmbed } from "@calcom/embed-core/embed-iframe";
import { POWERED_BY_URL } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";

const PoweredByCal = () => {
  const { t } = useLocale();
  const isEmbed = useIsEmbed();
  return <div className={"p-2 text-center text-xs sm:text-right" + (isEmbed ? " max-w-3xl" : "")} />;
};

export default PoweredByCal;
