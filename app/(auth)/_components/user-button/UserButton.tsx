"use client";

import NextImage from "next/image";
import { useAuthActions } from "@convex-dev/auth/react";
import { useGetUser } from "@/core/auth/services";
import UserDefaultImage from "@/shared/assets/images/user-default.png";
import styles from "./UserButton.module.css";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  Loader,
} from "@/shared/components";

function UserButton(): JSX.Element {
  const { data, isLoading } = useGetUser();
  const { signOut } = useAuthActions();

  const onSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isLoading) return <Loader />;

  if (!data) return <div />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {data.image ? (
            <AvatarImage className={styles["user-avatar-bg"]} src={data.image} alt="user" />
          ) : (
            <NextImage
              className={styles["user-avatar-bg"]}
              width={40}
              height={40}
              src={UserDefaultImage}
              alt="default-user"
            />
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className={styles["user-menu-item"]} onClick={onSignOut}>
          <LogOut className={styles["user-menu-item__icon"]} />
          <p>Sign Out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserButton;
