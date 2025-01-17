import { useRef, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui";
import { Icon } from "@calcom/ui/Icon";
import { Alert } from "@calcom/ui/v2/core/Alert";
import { Dialog, DialogContent, DialogFooter } from "@calcom/ui/v2/core/Dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamCreate(props: Props) {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const nameRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const createTeamMutation = trpc.useMutation("viewer.teams.create", {
    onSuccess: () => {
      utils.invalidateQueries(["viewer.teams.list"]);
      props.onClose();
    },
    onError: (e) => {
      setErrorMessage(e?.message || t("something_went_wrong"));
    },
  });

  const createTeam = () => {
    createTeamMutation.mutate({ name: nameRef?.current?.value });
  };

  return (
    <>
      <Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent type="creation" actionText={t("create_new_team")} actionOnClick={createTeam}>
          <div className="mb-4 sm:flex sm:items-start">
            <div className="bg-brand text-brandcontrast dark:bg-darkmodebrand dark:text-darkmodebrandcontrast mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-opacity-5 sm:mx-0 sm:h-10 sm:w-10">
              <Icon.FiUsers className="text-brandcontrast h-6 w-6" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                {t("create_new_team")}
              </h3>
              <div>
                <p className="text-sm text-gray-400">{t("create_new_team_description")}</p>
              </div>
            </div>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <input
                ref={nameRef}
                type="text"
                name="name"
                id="name"
                placeholder="Stackarmor"
                required
                className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            {errorMessage && <Alert severity="error" title={errorMessage} />}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
