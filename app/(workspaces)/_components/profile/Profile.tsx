"use client";

import NextLink from "next/link";
import { formatName } from "@/shared/utils";
import styles from "./Styles.module.css";
import { Mail, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, Separator } from "@/shared/components";
import { useGetMember } from "@/core/members/services";
import StartingLoader from "../loader/StartingLoader";
import WorkspaceContentError from "../content-error/WorkspaceContentError";

interface Props {
  memberId: string;
  onClose: () => void;
}

function Profile({ onClose, memberId }: Props): JSX.Element {
  const { response } = useGetMember(memberId);

  const isLoading = response === undefined;

  return (
    <div>
      <div className={styles["profile-header"]}>
        <div className={styles["profile-header__content"]}>
          <p>Profile</p>
          <Button variant="ghost" type="button" name="close-profile" onClick={onClose}>
            <X />
          </Button>
        </div>
        <Separator />
      </div>
      {isLoading ? (
        <StartingLoader reduceHeightIn={100} />
      ) : (
        <>
          {response.isError ? (
            <WorkspaceContentError description={response.message} reduceHeightIn={100} />
          ) : (
            <div className={styles["profile-body"]}>
              <div className={styles["profile-body__avatar"]}>
                <Avatar className={styles["profile-body__avatar-image"]}>
                  <AvatarImage src={response.data!.user.image} />
                  <AvatarFallback>
                    <p className={styles["profile-body__avatar-image"]}>
                      {formatName(response.data!.user.name ?? "MB")}
                    </p>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{response.data!.user.name}</p>
                </div>
              </div>
              <Separator />
              <div className={styles["profile-body__information"]}>
                <p>Contact information</p>
                <div className={styles["profile-info"]}>
                  <div className={styles["profile-info__icon"]}>
                    <Mail />
                  </div>
                  <div className={styles["profile-info__text"]}>
                    <p>Email Address</p>
                    <NextLink href={`mailto:${response.data!.user.email}`}>
                      {response.data!.user.email}
                    </NextLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Profile;
