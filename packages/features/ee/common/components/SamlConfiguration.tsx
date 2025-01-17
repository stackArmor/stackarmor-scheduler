import React, { useEffect, useRef, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import showToast from "@calcom/lib/notification";
import { collectPageParameters, telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { trpc } from "@calcom/trpc/react";
import { Alert } from "@calcom/ui/Alert";
import Badge from "@calcom/ui/Badge";
import Button from "@calcom/ui/Button";
import ConfirmationDialogContent from "@calcom/ui/ConfirmationDialogContent";
import { Dialog, DialogTrigger } from "@calcom/ui/Dialog";
import { TextArea } from "@calcom/ui/form/fields";

import LicenseRequired from "./LicenseRequired";

export default function SAMLConfiguration({
  teamsView,
  teamId,
}: {
  teamsView: boolean;
  teamId: null | undefined | number;
}) {
  const [isSAMLLoginEnabled, setIsSAMLLoginEnabled] = useState(false);
  const [samlConfig, setSAMLConfig] = useState<string | null>(null);

  const query = trpc.useQuery(["viewer.showSAMLView", { teamsView, teamId }]);

  const telemetry = useTelemetry();

  useEffect(() => {
    const data = query.data;
    setIsSAMLLoginEnabled(data?.isSAMLLoginEnabled ?? false);
    setSAMLConfig(data?.provider ?? null);
  }, [query.data]);

  const mutation = trpc.useMutation("viewer.updateSAMLConfig", {
    onSuccess: (data: { provider: string | undefined }) => {
      showToast(t("saml_config_updated_successfully"), "success");
      setHasErrors(false); // dismiss any open errors
      setSAMLConfig(data?.provider ?? null);
      samlConfigRef.current.value = "";
    },
    onError: () => {
      setHasErrors(true);
      setErrorMessage(t("saml_configuration_update_failed"));
      document?.getElementsByTagName("main")[0]?.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const deleteMutation = trpc.useMutation("viewer.deleteSAMLConfig", {
    onSuccess: () => {
      showToast(t("saml_config_deleted_successfully"), "success");
      setHasErrors(false); // dismiss any open errors
      setSAMLConfig(null);
      samlConfigRef.current.value = "";
    },
    onError: () => {
      setHasErrors(true);
      setErrorMessage(t("saml_configuration_delete_failed"));
      document?.getElementsByTagName("main")[0]?.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  const samlConfigRef = useRef<HTMLTextAreaElement>() as React.MutableRefObject<HTMLTextAreaElement>;

  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function updateSAMLConfigHandler(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();

    const rawMetadata = samlConfigRef.current.value;

    // track Google logins. Without personal data/payload
    telemetry.event(telemetryEventTypes.samlConfig, collectPageParameters());

    mutation.mutate({
      encodedRawMetadata: Buffer.from(rawMetadata).toString("base64"),
      teamId,
    });
  }

  async function deleteSAMLConfigHandler(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    event.preventDefault();

    deleteMutation.mutate({
      teamId,
    });
  }

  const { t } = useLocale();
  return (
    <>
      {isSAMLLoginEnabled ? (
        <LicenseRequired>
          <hr className="mt-8" />
          <div className="mt-6">
            <h2 className="font-cal text-lg font-medium leading-6 text-gray-900">
              {t("saml_configuration")}
              <Badge className="ml-2 text-xs" variant={samlConfig ? "success" : "gray"}>
                {samlConfig ? t("enabled") : t("disabled")}
              </Badge>
              {samlConfig ? (
                <>
                  <Badge className="ml-2 text-xs" variant="success">
                    {samlConfig ? samlConfig : ""}
                  </Badge>
                </>
              ) : null}
            </h2>
          </div>

          {samlConfig ? (
            <div className="mt-2 flex">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    color="warn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}>
                    {t("delete_saml_configuration")}
                  </Button>
                </DialogTrigger>
                <ConfirmationDialogContent
                  variety="danger"
                  title={t("delete_saml_configuration")}
                  confirmBtnText={t("confirm_delete_saml_configuration")}
                  cancelBtnText={t("cancel")}
                  onConfirm={deleteSAMLConfigHandler}>
                  {t("delete_saml_configuration_confirmation_message")}
                </ConfirmationDialogContent>
              </Dialog>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-500">{!samlConfig ? t("saml_not_configured_yet") : ""}</p>
          )}

          <p className="mt-1 text-sm text-gray-500">{t("saml_configuration_description")}</p>

          <form className="mt-3 divide-y divide-gray-200 lg:col-span-9" onSubmit={updateSAMLConfigHandler}>
            {hasErrors && <Alert severity="error" title={errorMessage} />}

            <TextArea
              data-testid="saml_config"
              ref={samlConfigRef}
              name="saml_config"
              id="saml_config"
              required={true}
              rows={10}
              placeholder={t("saml_configuration_placeholder")}
            />

            <div className="flex justify-end py-8">
              <Button style={{ backgroundColor: "#244d80", color: "white" }} type="submit">
                {t("save")}
              </Button>
            </div>
            <hr className="mt-4" />
          </form>
        </LicenseRequired>
      ) : null}
    </>
  );
}
