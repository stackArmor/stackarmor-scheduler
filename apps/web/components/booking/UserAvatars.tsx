import { CAL_URL } from "@calcom/lib/constants";

import AvatarGroup, { AvatarGroupProps } from "@components/ui/AvatarGroup";

export const UserAvatars = ({
  profile,
  users,
  ...props
}: {
  profile: { image: string | null; name?: string | null };
  showMembers: boolean;
  users: { username: string | null; name?: string | null }[];
} & Pick<AvatarGroupProps, "size" | "truncateAfter">) => {
  const showMembers = !users.find((user) => user.name === profile.name) && props.showMembers;
  return (
    <AvatarGroup
      border="border-2 dark:border-darkgray-100 border-white"
      items={
        [
          {
            image:
              "https://media-exp1.licdn.com/dms/image/C4D0BAQE-Gstn0TXAiA/company-logo_200_200/0/1593715496845?e=2147483647&v=beta&t=DFz7onhe-omSuH1GmpkNkV0RP4LN2WID63750KOxBYY",
            alt: profile.name,
            title: profile.name,
          },
          // { image: profile.image, alt: profile.name, title: profile.name },
          ...(showMembers
            ? users.map((user) => ({
                title: user.name,
                image: `${CAL_URL}/${user.username}/avatar.png`,
                alt: user.name || undefined,
              }))
            : []),
        ].filter((item) => !!item.image) as { image: string; alt?: string; title?: string }[]
      }
      size={props.size}
      truncateAfter={props.truncateAfter}
    />
  );
};
