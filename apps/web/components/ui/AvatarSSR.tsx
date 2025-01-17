import { User } from "@prisma/client";
import * as Tooltip from "@radix-ui/react-tooltip";

import { LOGO } from "@calcom/lib/constants";

import classNames from "@lib/classNames";

export type AvatarProps = (
  | {
      user: Pick<User, "name" | "username" | "avatar"> & { emailMd5?: string };
    }
  | {
      user?: null;
      imageSrc: string;
    }
) & {
  className?: string;
  size?: number;
  title?: string;
  alt: string;
};

// defaultAvatarSrc from profile.tsx can't be used as it imports crypto
function defaultAvatarSrc(md5: string) {
  // return `https://www.gravatar.com/avatar/${md5}?s=160&d=mp&r=PG`;
  return LOGO;
}

// An SSR Supported version of Avatar component.
export function AvatarSSR(props: AvatarProps) {
  const { size, title } = props;

  let imgSrc = "";
  let alt: string = props.alt;

  if (props.user) {
    const user = props.user;
    const nameOrUsername = user.name || user.username || "";
    alt = alt || nameOrUsername;

    if (user.avatar) {
      // imgSrc = user.avatar;
      imgSrc = LOGO;
    } else if (user.emailMd5) {
      // imgSrc = defaultAvatarSrc(user.emailMd5);
      imgSrc = LOGO;
    }
  } else {
    // imgSrc = props.imageSrc;
    imgSrc = LOGO;
  }

  // const className = classNames("rounded-none", props.className, size && `h-${size} w-${size}`);
  const className = classNames("rounded-none", props.className, size && `h-500 w-500`);

  const avatar = imgSrc ? <img alt={alt} className={className} src={imgSrc} /> : null;
  return title ? (
    <Tooltip.Tooltip delayDuration={300}>
      <Tooltip.TooltipTrigger className="cursor-default">{avatar}</Tooltip.TooltipTrigger>
      <Tooltip.Content className="rounded-sm bg-black p-2 text-sm text-white">
        <Tooltip.Arrow />
        {title}
      </Tooltip.Content>
    </Tooltip.Tooltip>
  ) : (
    <>{avatar}</>
  );
}
