"use client";

import { useState } from "react";
import { observer } from "mobx-react";
import Image from "next/image";
import useSWR from "swr";
import { Loader, ToggleSwitch, setPromiseToast } from "@plane/ui";
// components
import { AuthenticationMethodCard } from "@/components/authentication";
import { PageHeader } from "@/components/common";
// hooks
import { useInstance } from "@/hooks/store";
// icons
import OpenIDConnectLogo from "@/public/logos/oidc-logo.svg";
// local components
import { InstanceOpenIDConnectConfigForm } from "./form";

const InstanceOpenIDConnectAuthenticationPage = observer(() => {
  // store
  const { fetchInstanceConfigurations, formattedConfig, updateInstanceConfigurations } = useInstance();
  // state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // config
  const enableOpenIDConnectConfig = formattedConfig?.IS_OIDC_ENABLED ?? "";

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

  const updateConfig = async (key: "IS_OIDC_ENABLED", value: string) => {
    setIsSubmitting(true);

    const payload = {
      [key]: value,
    };

    const updateConfigPromise = updateInstanceConfigurations(payload);

    setPromiseToast(updateConfigPromise, {
      loading: "Saving Configuration...",
      success: {
        title: "Configuration saved",
        message: () => `OIDC authentication is now ${value ? "active" : "disabled"}.`,
      },
      error: {
        title: "Error",
        message: () => "Failed to save configuration",
      },
    });

    await updateConfigPromise
      .then(() => {
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
      });
  };
  return (
    <>
      <PageHeader title="OIDC Authentication - Plane Web" />
      <div className="relative container mx-auto w-full h-full p-4 py-4 space-y-6 flex flex-col">
        <div className="border-b border-custom-border-100 mx-4 py-4 space-y-1 flex-shrink-0">
          <AuthenticationMethodCard
            name="OIDC"
            description="Allow members to login or sign up to plane with their OIDC accounts."
            icon={<Image src={OpenIDConnectLogo} height={24} width={24} alt="OIDC Logo" />}
            config={
              <ToggleSwitch
                value={Boolean(parseInt(enableOpenIDConnectConfig))}
                onChange={() => {
                  Boolean(parseInt(enableOpenIDConnectConfig)) === true
                    ? updateConfig("IS_OIDC_ENABLED", "0")
                    : updateConfig("IS_OIDC_ENABLED", "1");
                }}
                size="sm"
                disabled={isSubmitting || !formattedConfig}
              />
            }
            disabled={isSubmitting || !formattedConfig}
            withBorder={false}
          />
        </div>
        <div className="flex-grow overflow-hidden overflow-y-scroll vertical-scrollbar scrollbar-md px-4">
          {formattedConfig ? (
            <InstanceOpenIDConnectConfigForm config={formattedConfig} />
          ) : (
            <Loader className="space-y-8">
              <Loader.Item height="50px" width="25%" />
              <Loader.Item height="50px" />
              <Loader.Item height="50px" />
              <Loader.Item height="50px" />
              <Loader.Item height="50px" width="50%" />
            </Loader>
          )}
        </div>
      </div>
    </>
  );
});

export default InstanceOpenIDConnectAuthenticationPage;
